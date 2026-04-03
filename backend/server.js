import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/viNotesDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

/* ================= USER ================= */
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

/* ================= NOTE ================= */
const noteSchema = new mongoose.Schema({
  userId: String,
  textContent: String,
  keystrokes: Number,
  pasteCount: Number,
  createdAt: Date
});

const Note = mongoose.model("Note", noteSchema);

/* ================= REGISTER ================= */
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error registering user" });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Wrong password" });
    }

    res.json({
      message: "Login successful",
      userId: user._id
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error logging in" });
  }
});

/* ================= SAVE (UPDATE SAME USER) ================= */
app.post("/save", async (req, res) => {
  try {
    const { userId, textContent, keystrokes, pasteCount } = req.body;

    let note = await Note.findOne({ userId });

    if (note) {
      note.textContent = textContent;
      note.keystrokes = keystrokes;
      note.pasteCount = pasteCount;
      note.createdAt = new Date();

      await note.save();
    } else {
      note = new Note({
        userId,
        textContent,
        keystrokes,
        pasteCount,
        createdAt: new Date()
      });

      await note.save();
    }

    res.json({ message: "Saved successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving note" });
  }
});

/* ================= DASHBOARD ================= */
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();

    const result = await Promise.all(
      notes.map(async (note) => {
        const user = await User.findById(note.userId);

        return {
          email: user?.email || "Unknown",
          textContent: note.textContent,
          keystrokes: note.keystrokes,
          pasteCount: note.pasteCount,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

/* ================= START ================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});