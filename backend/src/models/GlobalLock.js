import mongoose from "mongoose";

const globalLockSchema = new mongoose.Schema(
  {
    isSystemLocked: { type: Boolean, default: false },
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    unlockKeyHash: String
  },
  { timestamps: true }
);

export default mongoose.model("GlobalLock", globalLockSchema);