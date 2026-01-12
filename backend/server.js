// backend/server.js

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import fs from "fs";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ---------------------------
// Helpers
// ---------------------------
function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// ---------------------------
// Routes
// ---------------------------

// 1️⃣ Get all units with lesson metadata
app.get("/api/units", (req, res) => {
  try {
    const unitsFile = path.join(__dirname, "data/units.json");
    const data = readJSON(unitsFile);
    if (!data) return res.status(404).json({ error: "Units not found" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read units data" });
  }
});

// 2️⃣ Get lesson content by ID
app.get("/api/lessons/:id", (req, res) => {
  try {
    const lessonId = req.params.id;
    const lessonFile = path.join(__dirname, "data/lessons", `${lessonId}.json`);
    const lesson = readJSON(lessonFile);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read lesson data" });
  }
});

// 3️⃣ Check answer for a lesson quiz
// 3️⃣ Check answer for a lesson quiz
app.post("/api/check-answer", (req, res) => {
  try {
    const { lessonId, question, answer } = req.body;
    if (!lessonId || !question || !answer) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const lessonFile = path.join(__dirname, "data/lessons", `${lessonId}.json`);
    const lesson = readJSON(lessonFile);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    const quizQuestion = lesson.quiz?.find(q => q.question === question);
    if (!quizQuestion) return res.status(404).json({ error: "Question not found" });

    // Use the 'correct' field from JSON
    const correctAnswer = quizQuestion.correct;
    res.json({ correct: answer === correctAnswer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check answer" });
  }
});

// ---------------------------
// Start server
// ---------------------------
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
