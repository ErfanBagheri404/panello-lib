
import express from "express";
import Role from "../models/Role";
import { authenticateUser } from "./auth";

const router = express.Router();


router.get("/", authenticateUser, async (req, res, next) => {
  try {
    const roles = await Role.find();
    res.json(roles);
    return; 
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles" });
    return; 
  }
});


router.delete("/:id", authenticateUser, async (req, res, next) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);
    if (!deletedRole) {
      res.status(404).json({ error: "Role not found" });
      return; 
    }
    res.json(deletedRole);
    return; 
  } catch (error) {
    res.status(500).json({ error: "Failed to delete role" });
    return; 
  }
});


router.put("/:id", authenticateUser, async (req, res, next) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRole) {
      res.status(404).json({ error: "Role not found" });
      return; 
    }
    res.json(updatedRole);
    return; 
  } catch (error) {
    res.status(500).json({ error: "Failed to update role" });
    return; 
  }
});

export default router;