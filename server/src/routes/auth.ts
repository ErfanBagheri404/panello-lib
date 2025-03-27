import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  registerUser,
  loginUser,
  getProfile,
  googleAuth,
  googleAuthCallback,
  googleLogin,
  changePassword,
  updateAvatar,
  removeAvatar,
  upload,
} from "../controllers/authController";
import { fetchAIResponse } from "../controllers/openRouterController";

const router = express.Router();

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.error("No token provided");
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };
    (req as any).user = decoded;
    console.log("Token verified, user:", decoded);
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateUser, getProfile);
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);
router.post("/google", googleLogin);
router.put("/change-password", authenticateUser, changePassword);
router.post("/chat", fetchAIResponse);
router.put("/avatar", authenticateUser, upload.single("avatar"), updateAvatar);
router.delete("/avatar", authenticateUser, removeAvatar);

export default router;
