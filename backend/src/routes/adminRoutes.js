import express from "express";
import { unlockUser } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.put("/unlock-user/:id", protect, adminOnly, unlockUser);

export default router;