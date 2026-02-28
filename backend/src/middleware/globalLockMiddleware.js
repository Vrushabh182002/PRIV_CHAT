import GlobalLock from "../models/GlobalLock.js";

export const checkGlobalLock = async (req, res, next) => {
  const lock = await GlobalLock.findOne();

  if (lock?.isSystemLocked && req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "System locked" });
  }

  next();
};