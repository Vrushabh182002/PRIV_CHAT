import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    metadata: Object
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditSchema);