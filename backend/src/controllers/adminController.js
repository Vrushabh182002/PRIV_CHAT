import bcrypt from "bcrypt";
import GlobalLock from "../models/GlobalLock.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";

export const unlockSystem = async (req, res) => {
  try {
    const { userId, key } = req.body;

    const [user, lock] = await Promise.all([
      User.findById(userId),
      GlobalLock.findOne(),
    ]);
 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
 
    if (!lock?.isSystemLocked) {
      return res.status(400).json({ message: "System is not locked" });
    }
 
    if (lock.triggeredBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "User did not trigger the lock" });
    }
 
    const valid = await bcrypt.compare(key, lock.unlockKeyHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid unlock key" });
    }
 
    // Reset the lock
    lock.isSystemLocked = false;
    lock.triggeredBy = null;
    lock.unlockKeyHash = null;
    await lock.save();
 
    await AuditLog.create({
      action: "SYSTEM_UNLOCK",
      performedBy: req.user._id,
      targetUser: user._id,
    });
 
    return res.json({ message: "System unlocked successfully" });
  } catch (error) {
    console.error("unlockSystem error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
 
export const unlockUser = async (req, res) => {
  try {
    const { id } = req.params;
 
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
 
    // Mutate before parallel save
    user.isLocked = false;
    user.failedAttempts = 0;
 
    await Promise.all([
      user.save(),
      AuditLog.create({
        action: "USER_UNLOCK",
        performedBy: req.user._id,
        targetUser: user._id,
      }),
    ]);
 
    return res.json({ message: "User account unlocked successfully" });
  } catch (error) {
    console.error("unlockUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};