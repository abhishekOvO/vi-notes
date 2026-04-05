import express from "express";
import { saveNote,  getMyNote } from "../controllers/noteController";
import { getAllNotes } from "../controllers/noteController";
import { verifyToken } from "../middleware/auth";



const router = express.Router();


router.post("/save", verifyToken, saveNote);
router.get("/my-note", verifyToken, getMyNote);
router.get("/notes", verifyToken, getAllNotes);

export default router;