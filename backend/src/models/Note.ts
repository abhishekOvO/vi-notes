import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  userId: String,
  textContent: String,
  keystrokes: Number,
  pasteCount: Number,
  createdAt: Date,
});

export default mongoose.model("Note", noteSchema);