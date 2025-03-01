import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const user = new User({ email, password });
  await user.save();

  res.status(201).json({ message: "User registered successfully" });
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  res.json({ token });
};

export { registerUser, loginUser };
