import mongoose, { Schema, Document } from "mongoose";

export interface IReminder extends Document {
  title: string;
  date: Date;
  completed: boolean;
  _id: mongoose.Types.ObjectId;
}

const ReminderSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: function (date: Date) {
          const inputDate = new Date(date);
          const today = new Date();

          // Truncate to UTC midnight
          const inputUTCDate = Date.UTC(
            inputDate.getUTCFullYear(),
            inputDate.getUTCMonth(),
            inputDate.getUTCDate()
          );
          const todayUTCDate = Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate()
          );

          return inputDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0);
        },
        message: "Date must be today or in the future (UTC time)",
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReminder>("Reminder", ReminderSchema);
