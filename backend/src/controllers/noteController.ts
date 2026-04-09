import { Request, Response } from "express";
import Note from "../models/Note";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";


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

