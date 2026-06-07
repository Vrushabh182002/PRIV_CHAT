import bcrypt from "bcrypt";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";

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
    user.unlockKeyHash = null;
 
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