import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import rateLimit from "express-rate-limit";
import { connectToDB } from "./src/config/db.js";
import { initSocket } from "./src/config/socket.js";

import authRoutes from "./src/routes/authRoutes.js";
// import chatRoutes from "./src/routes/chatRoutes.js";
// import messageRoutes from "./src/routes/messageRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT;

initSocket(server);

app.use(helmet());
app.use(cors());
app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many login attempts. Try again 15 minutes later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//Routes
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoutes);
// app.use("/api/chats", chatRoutes);
// app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

//Testing
app.get("/", (req, res) => {
  res.send("I am live and ready.");
});

server.listen(port || 8080, () => {
  connectToDB();
  console.log(`Server is running at http://localhost:${port}`);
});
