import express from "express";
import { saveNote,  getMyNote } from "../controllers/noteController";

const router = express.Router();
import { verifyToken } from "../middleware/auth";

router.post("/save", verifyToken, saveNote);
router.get("/my-note", verifyToken, getMyNote);

export default router;