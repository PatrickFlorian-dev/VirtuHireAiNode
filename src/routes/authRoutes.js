import express from "express";
import { register, login, refreshToken, logout } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Public Routes (No Authentication Required)
router.post("/register", register);
router.post("/login", login);

// 🔒 Protected Routes (Require Authentication)
router.post("/refresh-token", authenticateToken, refreshToken);
router.post("/logout", authenticateToken, logout);

export default router;
