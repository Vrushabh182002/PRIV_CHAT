import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastMessage: String,
  updatedAt: Date,
});
chatSchema.index({ participants: 1 });

export default mongoose.model("Chats", chatSchema);
