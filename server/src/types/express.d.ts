import { Request } from "express";
import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
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
export interface IEvent extends Document {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color: string;
  user: mongoose.Types.ObjectId;
  sharedWith: mongoose.Types.ObjectId[];
}
export interface IMessage extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  type: "text" | "image" | "file";
  isRead: boolean;
  updatedAt: Date;
  createdAt: Date;
}
export interface IReminder extends Document {
  title: string;
  date: Date;
  completed: boolean;
  _id: mongoose.Types.ObjectId;
}
export interface IRole extends Document {
  [x: string]: ObjectId;
  name: string;
  description: string;
  id: string;
}
export interface ITask extends Document {
  title: string;
  description?: string;
  subtasks: string[];
  color: string;
  user: IUser["_id"];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: IUser["_id"][];
}

export interface IUser extends Document {
  [x: string]: any;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  role: string;
  isInvited: boolean;
  accountState: string;
  createdAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}
declare module 'express-serve-static-core' {
  interface Request {
    user?: { userId: string };
  }
}