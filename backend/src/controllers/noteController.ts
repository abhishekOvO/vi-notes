import { Request, Response } from "express";
import Note from "../models/Note";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

export const saveNote = async (req: AuthRequest, res: Response) => {
  try {
   
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { textContent, keystrokes, pasteCount } = req.body;
    const userId = req.user.userId;

    const note = await Note.findOneAndUpdate(
      { userId },
      {
        textContent,
        keystrokes,
        pasteCount,
        createdAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Saved" });
  } catch (err) {
    console.log("SAVE ERROR 👉", err); 
    res.status(500).json({ success: false });
  }
};

export const getMyNote = async (req: AuthRequest, res: Response) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.userId;

    const note = await Note.findOne({ userId });

    res.json({
      success: true,
      note: note || null,
    });
  } catch (err) {
    console.log("FETCH ERROR 👉", err); 
    res.status(500).json({ success: false });
  }
};

export const getAllNotes = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    
    const currentUser = await User.findById(req.user.userId);

    if (!currentUser || !currentUser.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    
    const notes = await Note.find();

    const users = await User.find();

    const result = notes.map((note) => {
      const user = users.find((u) => u._id.toString() === note.userId);

      return {
        email: user?.email || "Unknown",
        keystrokes: note.keystrokes,
        pasteCount: note.pasteCount,
      };
    });

    res.json(result);
  } catch (err) {
    console.log("ADMIN FETCH ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};