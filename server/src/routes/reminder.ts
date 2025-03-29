import express from "express";
import { Request, Response } from "express";
import Reminder from "../models/Reminder";
import { authenticateUser } from "./auth";
import mongoose from "mongoose";

const router = express.Router();

// GET all reminders for authenticated user
router.get("/", authenticateUser, async (req: Request, res: Response) => {
  // Removed explicit Promise<void>
  try {
    const userId = (req as any).user.userId;
    const reminders = await Reminder.find({ userId });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { title, date } = req.body;
    if (!title || !date) {
      res.status(400).json({ error: "Title and date are required" });
      return;
    }

    const [year, month, day] = date.split("-").map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    const userId = (req as any).user.userId;
    const newReminder = new Reminder({
      title,
      date: parsedDate,
      userId: new mongoose.Types.ObjectId(userId),
      completed: false,
    });
    await newReminder.save();
    res.status(201).json(newReminder);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// PUT update reminder
router.put("/:id", authenticateUser, async (req: Request, res: Response) => {
  // Removed explicit Promise<void>
  try {
    const { id } = req.params;
    const updatedReminder = await Reminder.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId((req as any).user.userId)
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedReminder) {
      res.status(404).json({ error: "Reminder not found" });
      return;
    }

    res.json(updatedReminder);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// DELETE reminder
router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedReminder = await Reminder.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId((req as any).user.userId)
    });

    if (!deletedReminder) {
      res.status(404).json({ error: "Reminder not found" });
      return;
    }

    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
