import express, { Request, Response } from "express";
import Task from "../models/Task";
import { authenticateUser } from "./auth";

// Extend the Express Request interface to include the user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: { userId: string };
  }
}

const router = express.Router();

// Get all tasks for the authenticated user
router.get(
  "/",
  authenticateUser,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const tasks = await Task.find({ user: userId });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }
);

// Create a new task
router.post(
  "/",
  authenticateUser,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const newTask = new Task({
        ...req.body,
        user: userId,
      });
      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(400).json({ error: "Failed to create task" });
    }
  }
);

// Update an existing task
router.put(
  "/:id",
  authenticateUser,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: userId },
        req.body,
        { new: true }
      );
      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Failed to update task" });
    }
  }
);

// Delete a task
router.delete(
  "/:id",
  authenticateUser,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: userId,
      });
      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      res.json({ message: "Task deleted" });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete task" });
    }
  }
);

export default router;