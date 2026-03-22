import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import GlobalLock from "../models/GlobalLock.js";
import Message from "../models/Message.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  // ── Auth Middleware
  // Runs before every connection — verifies the JWT from handshake
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized: no token"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Unauthorized: invalid token"));
    }
  });

  // ── Connection Handler
  io.on("connection", async (socket) => {
    try {
      const lock = await GlobalLock.findOne();

      if (lock?.isSystemLocked && socket.user.role !== "ADMIN") {
        return socket.disconnect(true);
      }

      // User joins their own private room (for direct DMs / notifications)
      socket.join(socket.user.id);
      console.log(`User ${socket.user.id} connected`);

      // ── joinChat
      socket.on("joinChat", (chatId) => {
        socket.join(chatId);
      });

      socket.on("sendMessage", async (data) => {
        try {
          const { chatId, content, messageType = "text" } = data;

          // Persist to MongoDB BEFORE broadcasting
          // This guarantees message history, offline delivery, and consistency.
          // The saved doc (with _id, createdAt) is what recipients receive —
          // not the raw unvalidated client payload.
          const savedMessage = await Message.create({
            chatId,
            senderId: socket.user.id,
            content,
            messageType,
          });

          // Broadcast the persisted document to all room members
          io.to(chatId).emit("receiveMessage", savedMessage);
        } catch (error) {
          console.error("sendMessage error:", error);
          socket.emit("messageError", { message: "Failed to send message" });
        }
      });

      // ── disconnect
      socket.on("disconnect", () => {
        console.log(`User ${socket.user.id} disconnected`);
      });
    } catch (error) {
      console.error("Socket connection error:", error);
      socket.disconnect(true);
    }
  });

  return io;
};