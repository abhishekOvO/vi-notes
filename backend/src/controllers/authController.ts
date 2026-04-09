import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    let { email, password, confirmPassword } = req.body;

    email = email.toLowerCase().trim();

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Weak password",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await new User({
      email,
      password: hashedPassword,
      isAdmin: false,
    }).save();

    res.status(201).json({
      success: true,
      message: "Registered successfully",
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate email",
      });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const login = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }

    // ✅ CREATE TOKEN
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
  success: true,
  message: "Login success",
  token,
  isAdmin: user.isAdmin,
  userId: user._id   // ✅ ADD THIS
});

  } catch {
    res.status(500).json({ success: false, message: "Login error" });
  }
};