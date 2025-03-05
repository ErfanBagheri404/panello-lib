  // auth.ts
  import express from "express";
  import { Request, Response, NextFunction } from 'express';
  import jwt from 'jsonwebtoken';
  import {
    registerUser,
    loginUser,
    googleAuth,
    getProfile,
  } from "../controllers/authController";

  const router = express.Router();

  export const authenticateUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        email: string;
        role: string;
      };
      
      // Type assertion for req.user
      (req as unknown as { user: typeof decoded }).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  router.post("/register", registerUser);
  router.post("/login", loginUser);
  router.post("/google", googleAuth);
  router.get('/profile', authenticateUser, getProfile);

  export default router;
