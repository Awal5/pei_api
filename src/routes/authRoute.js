import express from "express";
import {
  getAdmin,
  register,
  login,
  logout,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/admin", verifyToken, getAdmin);
router.post("/register", register);
router.post("/login", login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

export default router;
