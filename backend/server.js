import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import rateLimit from "express-rate-limit";
import { connectToDB } from "./src/config/db.js";
import { initSocket } from "./src/config/socket.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

// ── Middleware
app.use(helmet());

// ── CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

// ── Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Routes
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Checking Server — verifies server is up
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

const startServer = async () => {
  await connectToDB();

  initSocket(server);

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

startServer();