import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import GlobalLock from "../models/GlobalLock.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const lock = await GlobalLock.findOne();

    if (lock?.isSystemLocked && socket.user.role !== "ADMIN") {
      return socket.disconnect(true);
    }

    socket.join(socket.user.id);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("sendMessage", (data) => {
      io.to(data.chatId).emit("receiveMessage", data);
    });
  });
  return io;
};