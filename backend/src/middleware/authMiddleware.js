import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Not Authorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash -panicPasswordHash");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (user.isLocked) {
      return res.status(403).json({ message: "Account is locked" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};