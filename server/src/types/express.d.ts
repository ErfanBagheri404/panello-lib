// types/express.d.ts
import { Request } from "express";
import mongoose from "mongoose";
declare global {
  namespace Express {
    interface Request {
      user?: {
        user?: User;
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}
declare global {
  namespace mongoose {
    interface Document {
      id: string;
      _id: mongoose.Types.ObjectId;
    }
  }
}
