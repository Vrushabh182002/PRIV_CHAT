import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  // ── Auth Middleware
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
      // 🔥 FETCH USER FROM DB (IMPORTANT)
      const user = await User.findById(socket.user.id);

      if (!user) {
        return socket.disconnect(true);
      }

      // ❌ BLOCK ONLY THIS USER IF LOCKED
      if (user.isLocked) {
        console.log(`Blocked locked user: ${user._id}`);
        return socket.disconnect(true);
      }

      // Join private room
      socket.join(user._id.toString());
      console.log(`User ${user._id} connected`);

      // ── joinChat
      socket.on("joinChat", (chatId) => {
        socket.join(chatId);
      });

      // ── sendMessage
      socket.on("sendMessage", async (data) => {
        try {
          const { chatId, content, messageType = "text" } = data;

          const savedMessage = await Message.create({
            chatId,
            senderId: user._id,
            content,
            messageType,
          });

          io.to(chatId).emit("receiveMessage", savedMessage);
        } catch (error) {
          console.error("sendMessage error:", error);
          socket.emit("messageError", {
            message: "Failed to send message",
          });
        }
      });

      // ── disconnect
      socket.on("disconnect", () => {
        console.log(`User ${user._id} disconnected`);
      });
    } catch (error) {
      console.error("Socket connection error:", error);
      socket.disconnect(true);
    }
  });

  return io;
};