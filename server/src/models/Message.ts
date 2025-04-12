import mongoose, { Schema, Document, Types } from "mongoose";
import { IMessage } from "../types/express";



const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add virtual for populated sender
messageSchema.virtual('senderName').get(function() {
  return (this.sender as any)?.name || 'Unknown';
});

// Add toJSON transform to include virtuals
messageSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    delete ret._id;
    return ret;
  }
});

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;