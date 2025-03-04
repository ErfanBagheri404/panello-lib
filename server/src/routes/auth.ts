// auth.ts
import express from "express";
import {
  registerUser,
  loginUser,
  googleAuth,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);


export default router;
