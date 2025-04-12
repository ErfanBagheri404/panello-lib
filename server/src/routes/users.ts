import express from "express";
import User from "../models/User";
import { authenticateUser } from "./auth";
const router = express.Router();

router.use((req, res, next) => {
  console.log(`[Users Router] ${req.method} ${req.url}`);
  next();
});

router.get(
  "/check-email",
  authenticateUser,
  async (req: express.Request, res: express.Response) => {
    const { email } = req.query;
    if (!email) {
      console.error("Email parameter missing in check-email");
      res.status(400).json({ error: "Email required" });
      return;
    }
    try {
      const user = await User.findOne({ email: email as string });
      console.log("Check-email result for", email, ":", !!user);
      res.json({ exists: !!user, avatar: user ? user.avatar : undefined });
    } catch (error) {
      console.error("Error in check-email endpoint:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.put(
  "/invite",
  authenticateUser,
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const userRole = (req as any).user?.role;
      console.log("Invite request received. Request user role:", userRole);
      if (userRole !== "owner" && userRole !== "administrator") {
        console.error("Unauthorized invite attempt by role:", userRole);
        res.status(403).json({ error: "Unauthorized" });
        return;
      }
      const { email, role } = req.body;
      console.log("Invite payload received:", { email, role });
      const validRoles = [
        "owner",
        "co-owner",
        "administrator",
        "moderator",
        "member",
      ];
      if (!validRoles.includes(role)) {
        console.error("Invalid role provided:", role);
        res.status(400).json({ error: "Invalid role" });
        return;
      }
      const user = await User.findOneAndUpdate(
        { email: { $regex: new RegExp(`^${email}$`, "i") } },
        { $set: { isInvited: true, role } },
        { new: true }
      );
      if (!user) {
        console.error("User not found for invitation, email:", email);
        res.status(404).json({ error: "User not found" });
        return;
      }
      console.log("User invited successfully:", user.email);
      res.json({
        success: true,
        user: {
          email: user.email,
          role: user.role,
          isInvited: user.isInvited,
        },
      });
    } catch (error) {
      console.error("Error in invite endpoint:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/members", authenticateUser, async (req, res) => {
  try {
    console.log("Fetching members...");
    const members = await User.find({ isInvited: true })
      .select("_id firstName lastName role createdAt accountState avatar")
      .lean()
      .exec();

    const formattedMembers = members.map((user) => {
      const createdAt = user.createdAt || new Date();

      return {
        id: String(user._id),
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        dateAdded: createdAt.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
        status: "Offline",
        accountState: user.accountState,
        avatar: user.avatar,
      };
    });
    res.json(formattedMembers);
  } catch (error) {
    console.error("Failed to fetch members:", error);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

export default router;
