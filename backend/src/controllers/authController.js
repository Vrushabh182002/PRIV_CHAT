import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import GlobalLock from "../models/GlobalLock.js";
import AuditLog from "../models/AuditLog.js";
import { generateUnlockKey } from "../utils/generateUnlockKey.js";

export const register = async (req, res) => {
  debugger;
  const { username, email, password, panicPassword, role } = req.body;

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

  const hash = await bcrypt.hash(password, 12);
  const panicHash = await bcrypt.hash(panicPassword, 12);

  await User.create({
    username,
    email,
    passwordHash: hash,
    panicPasswordHash: panicHash,
    role,
  });

  res.json({ message: "Registered" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const global = await GlobalLock.findOne();

  if (global?.isSystemLocked) {
    return res.status(403).json({ message: "System locked" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (user.isLocked) {
    return res.status(403).json({ message: "Account locked" });
  }

  const panicMatch = await bcrypt.compare(password, user.panicPasswordHash);

  if (panicMatch) {
    return await triggerSystemLock(user, res, "SYSTEM_LOCKED_BY_PANIC");
  }

  const reversed = password.split("").reverse().join("");
  const reverseMatch = await bcrypt.compare(reversed, user.passwordHash);

  if (reverseMatch) {
    return await triggerSystemLock(user, res, "SYSTEM_LOCKED_BY_REVERSE");
  }

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    user.failedAttempts += 1;
    if (user.failedAttempts >= 4) user.isLocked = true;
    await user.save();
    await AuditLog.create({
      action: "FAILED_LOGIN",
      performedBy: user._id,
    });
    return res.status(400).json({ message: "Wrong password" });
  }

  user.failedAttempts = 0;
  await user.save();

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  res.json({ token });
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
  });
};
