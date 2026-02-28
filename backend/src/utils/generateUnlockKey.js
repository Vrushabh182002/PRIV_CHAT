import crypto from "crypto";
import bcrypt from "bcrypt";

export const generateUnlockKey = async () => {
  const key = crypto.randomBytes(32).toString("hex");
  const hashedKey = await bcrypt.hash(key, 12);
  return { key, hashedKey };
};