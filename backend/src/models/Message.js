import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  senderId: { type: ObjectId, ref: "User" },
  messageType: { type: String, enum: ["text", "image", "file"] },
  content: String,
  fileMeta: {
    fileName: String,
    fileSize: Number,
    fileType: String,
  },
  createdAt: Date,
});
messageSchema.index({ chatId: 1, createdAt: -1 });

export default mongoose.model("Messages", messageSchema);
