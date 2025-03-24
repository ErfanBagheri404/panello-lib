import mongoose, { Document, Schema } from "mongoose";
import User, { IUser } from "./User";

export interface ITask extends Document {
  title: string;
  description?: string;
  subtasks: string[];
  color: string;
  user: IUser["_id"];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    subtasks: { type: [String], default: [] },
    color: { type: String, default: "#4B00FF" },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;