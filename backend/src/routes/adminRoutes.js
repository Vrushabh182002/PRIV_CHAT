import express from "express";
import { unlockSystem, unlockUser } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/unlock", protect, adminOnly, unlockSystem);

router.put("/unlock-user/:id", protect, adminOnly, unlockUser);

export default router;