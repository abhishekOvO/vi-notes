import express from "express";
import { saveNote,  getMyNote ,getAllNotes} from "../controllers/noteController";
import { verifyToken } from "../middleware/auth";
const router = express.Router();

router.get("/notes", verifyToken, getAllNotes);
router.post("/save", verifyToken, saveNote);
router.get("/my-note", verifyToken, getMyNote);


export default router;