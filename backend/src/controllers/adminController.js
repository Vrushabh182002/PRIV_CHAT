import bcrypt from "bcrypt";
import GlobalLock from "../models/GlobalLock.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";

export const unlockSystem = async (req, res) => {
  const { userId, username, key } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (username && user.username !== username)
    return res.status(400).json({ message: "Username mismatch" });

  const lock = await GlobalLock.findOne();
  if (!lock?.isSystemLocked)
    return res.status(400).json({ message: "System not locked" });

  if (lock.triggeredBy.toString() !== user._id.toString())
    return res.status(403).json({ message: "User did not trigger lock" });

  const valid = await bcrypt.compare(key, lock.unlockKeyHash);
  if (!valid) return res.status(401).json({ message: "Invalid key" });

  lock.isSystemLocked = false;
  lock.triggeredBy = null;
  lock.unlockKeyHash = null;
  await lock.save();

  await AuditLog.create({
    action: "SYSTEM_UNLOCK",
    performedBy: req.user._id,
    targetUser: user._id,
  });

  res.json({ message: "System unlocked" });
};

export const unlockUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Reset account lock
  user.isLocked = false;
  user.failedAttempts = 0;
  await user.save();

  // Audit log
  await AuditLog.create({
    action: "USER_UNLOCK",
    performedBy: req.user._id,
    targetUser: user._id,
  });

  res.json({ message: "User account unlocked" });
};