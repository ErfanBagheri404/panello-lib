import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import { configurePassport } from "./config/passport";
import Role from "./models/Role";
import roleRoutes from "./routes/roles";
import taskRoutes from "./routes/tasks";
import Task from "./models/Task";
import { fetchAIResponse } from "./controllers/openRouterController";
import eventRoutes from "./routes/events";
import reminderRoutes from "./routes/reminder";
import messagesRoutes from "./routes/messages";
import Message from "./models/Message";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  console.log(`[Server] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // or specify frontend URL
    methods: ["GET", "POST"],
  },
});

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const seedRoles = async () => {
  const existingRoles = await Role.find();
  if (existingRoles.length) return;

  const initialRoles = [
    { name: "owner", description: "Full access to all settings and data." },
    {
      name: "co-owner",
      description: "Same as Owner, except cannot remove the Owner.",
    },
    {
      name: "administrator",
      description: "Can manage users and settings but cannot delete the app.",
    },
    {
      name: "moderator",
      description: "Can manage user activity and enforce rules.",
    },
    {
      name: "member",
      description: "Standard access with no administrative rights.",
    },
  ];

  await Role.insertMany(initialRoles);
};

seedRoles();

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/openrouter", fetchAIResponse);
app.use("/api/events", eventRoutes);
app.use("/api/reminders", reminderRoutes);
// Update routes initialization
app.use("/api/messages", messagesRoutes(io));

app.get("/", (req, res) => {
  res.redirect("/login");
});
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("join", (userId) => {
    console.log("👥 User joined room:", userId);
    socket.join(userId);
  });

  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, content, type } = data;

    try {
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content,
        type: type || "text",
      });

      const savedMessage = await message.save();
      const populatedMessage = await Message.findById(savedMessage._id).populate("sender", "name");
      io.to(receiverId).emit("receiveMessage", populatedMessage);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});