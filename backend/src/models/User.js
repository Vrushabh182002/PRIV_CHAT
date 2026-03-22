import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, unique: true, lowercase: true, trim: true },
    passwordHash: String,

    panicPasswordHash: String,

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    failedAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);