import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import { configurePassport } from "./config/passport"; // Ensure you have this file configured
import Role from "./models/Role";
import roleRoutes from "./routes/roles";

dotenv.config();

const app = express();

// Debug: log each request method and URL.
app.use((req, res, next) => {
  console.log(`[Server] ${req.method} ${req.url}`);
  next();
});

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for the client (http://localhost:5173)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

// Connect to MongoDB
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
      { name: "co-owner", description: "Same as Owner, except cannot remove the Owner." },
      { name: "administrator", description: "Can manage users and settings but cannot delete the app." },
      { name: "moderator", description: "Can manage user activity and enforce rules." },
      { name: "member", description: "Standard access with no administrative rights." },
    ];
  
    await Role.insertMany(initialRoles);
  };
  
  seedRoles();

// Configure sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

// Setup Passport for authentication
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);

// A simple redirect for the base route.
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Start the server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
