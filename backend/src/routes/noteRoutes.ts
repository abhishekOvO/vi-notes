import express from "express";
import { getMyNote } from "../controllers/noteController";

import { verifyToken } from "../middleware/auth";



const router = express.Router();



router.get("/my-note", verifyToken, getMyNote);


export default router;