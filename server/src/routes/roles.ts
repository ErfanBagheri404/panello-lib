// routes/roles.ts
import express from "express";
import Role from "../models/Role";
import { authenticateUser } from "./auth";

const router = express.Router();

// Get all roles
router.get("/", authenticateUser, async (req, res, next) => {
  try {
    const roles = await Role.find();
    res.json(roles);
    return; // Explicit return after response
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles" });
    return; // Explicit return after error handling
  }
});

// Delete a role
router.delete("/:id", authenticateUser, async (req, res, next) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);
    if (!deletedRole) {
      res.status(404).json({ error: "Role not found" });
      return; // Exit early if not found
    }
    res.json(deletedRole);
    return; // Explicit return
  } catch (error) {
    res.status(500).json({ error: "Failed to delete role" });
    return; // Explicit return
  }
});

// Update a role
router.put("/:id", authenticateUser, async (req, res, next) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRole) {
      res.status(404).json({ error: "Role not found" });
      return; // Exit early if not found
    }
    res.json(updatedRole);
    return; // Explicit return
  } catch (error) {
    res.status(500).json({ error: "Failed to update role" });
    return; // Explicit return
  }
});

export default router;