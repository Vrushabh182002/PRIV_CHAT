import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import GlobalLock from "../models/GlobalLock.js";
import AuditLog from "../models/AuditLog.js";
import { generateUnlockKey } from "../utils/generateUnlockKey.js";

export const register = async (req, res) => {
  const { username, email, password, panicPassword } = req.body;

  if (!panicPassword) {
    return res.status(400).json({ message: "Panic password required" });
  }

  if (password === panicPassword) {
    return res.status(400).json({
      message: "Panic password must differ from main password",
    });
  }

  const reversed = password.split("").reverse().join("");
  if (panicPassword === reversed) {
    return res.status(400).json({
      message: "Panic password cannot equal reverse of main password",
    });
  }

  const [passwordHash, panicPasswordHash] = await Promise.all([
    bcrypt.hash(password, 12),
    bcrypt.hash(panicPassword, 12),
  ]);

  await User.create({
    username,
    email,
    passwordHash,
    panicPasswordHash,
    role: "USER",
  });

  res.status(201).json({ message: "Registered successfully" });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const globalLock = await GlobalLock.findOne();
    if (globalLock?.isSystemLocked) {
      return res.status(403).json({ message: "System locked" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.isLocked) {
      return res.status(403).json({ message: "Account locked" });
    }

    const [panicMatch, normalMatch] = await Promise.all([
      bcrypt.compare(password, user.panicPasswordHash),
      bcrypt.compare(password, user.passwordHash),
    ]);

    if (panicMatch) {
      return await triggerSystemLock(user, res, "SYSTEM_LOCKED_BY_PANIC");
    }

    if (!normalMatch) {
      user.failedAttempts += 1;
      if (user.failedAttempts >= 4) user.isLocked = true;
      await user.save();
      await AuditLog.create({
        action: "FAILED_LOGIN",
        performedBy: user._id,
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.failedAttempts = 0;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    return res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const triggerSystemLock = async (user, res, actionType) => {
  const { key, hashedKey } = await generateUnlockKey();

  await GlobalLock.updateOne(
    {},
    {
      isSystemLocked: true,
      triggeredBy: user._id,
      unlockKeyHash: hashedKey,
    },
    { upsert: true },
  );

  await AuditLog.create({
    action: actionType,
    performedBy: user._id,
  });

  return res.status(403).json({
    message: "Emergency lock triggered",
    unlockKey: key,
  });
};