// models/Event.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color: string;
  user: mongoose.Types.ObjectId;
  sharedWith: mongoose.Types.ObjectId[];
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    color: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>("Event", EventSchema);
