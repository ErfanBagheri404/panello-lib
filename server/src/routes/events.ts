import express from "express";
import { Request, Response } from "express";
import Event from "../models/Event";
import { authenticateUser } from "./auth";

const router = express.Router();

// Get all events for user
router.get("/", authenticateUser, async (req: Request, res: Response): Promise<void> => {
    try {
        const events = await Event.find({ user: (req as any).user.userId });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Create new event
router.post("/", authenticateUser, async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, start, end, color } = req.body;
        const event = new Event({
            title,
            description,
            start: new Date(start),
            end: new Date(end),
            color,
            user: (req as any).user.userId,
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: "Invalid event data" });
    }
});

// Update event
router.put("/:id", authenticateUser, async (req: Request, res: Response): Promise<void> => {
    try {
        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, user: (req as any).user.userId },
            req.body,
            { new: true }
        );
        if (!event) {
            res.status(404).json({ error: "Event not found" });
            return;
        }
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: "Invalid update" });
    }
});

// Delete event
router.delete("/:id", authenticateUser, async (req: Request, res: Response): Promise<void> => {
    try {
        const event = await Event.findOneAndDelete({
            _id: req.params.id,
            user: (req as any).user.userId,
        });
        if (!event) {
            res.status(404).json({ error: "Event not found" });
            return;
        }
        res.json({ message: "Event deleted" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;