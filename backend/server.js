// backend/server.js

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import fs from "fs/promises"; // async fs API

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
async function readJSON(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    if (err.code === "ENOENT") return null; // file not found
    throw err; // rethrow other errors like invalid JSON
  }
}

// ---------------------------
// Routes
// ---------------------------

// 1️⃣ Get all units with lesson metadata
app.get("/api/units", async (req, res) => {
  try {
    const unitsFile = path.join(__dirname, "data/units.json");
    const data = await readJSON(unitsFile);
    if (!data) return res.status(404).json({ error: "Units not found" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read units data" });
  }
});

// 2️⃣ Get lesson content by ID
app.get("/api/lessons/:id", async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lessonFile = path.join(__dirname, "data/lessons", `${lessonId}.json`);
    const lesson = await readJSON(lessonFile);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    // Remove correct answers from quiz blocks before sending
    if (lesson.content) {
      lesson.content = lesson.content.map(block => {
        if (block.type === "alphabetNaming") {
          // remove correctAnswer from each row
          return {
            ...block,
            rows: block.rows
          };
        } else if (block.type === "alphabetQuiz") {
          return {
            ...block,
            letters: block.letters
          };
        } else if (block.type === "tf") {
          return {
            ...block,
            questions: block.questions.map(q => ({ id: q.id, text: q.text }))
          };
        }
        return block;
      });
    }

    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read lesson data" });
  }
});

// 3️⃣ Check answer for a lesson quiz securely
app.post("/api/check-answer", async (req, res) => {
  try {
    const { lessonId, blockType, questionId, answer } = req.body;
    if (!lessonId || !blockType || !questionId || answer === undefined) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const lessonFile = path.join(__dirname, "data/lessons", `${lessonId}.json`);
    const lesson = await readJSON(lessonFile);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    let isCorrect = false;

    switch (blockType) {
      case "alphabetNaming":
        const namingBlock = lesson.content.find(b => b.type === "alphabetNaming");
        if (!namingBlock) return res.status(404).json({ error: "Quiz not found" });

        const row = namingBlock.rows.find(r => r[0] === questionId);
        if (!row) return res.status(404).json({ error: "Question not found" });

        const correctAnswer = row[1];
        isCorrect = answer === correctAnswer;
        break;

      case "alphabetQuiz":
        const orderBlock = lesson.content.find(b => b.type === "alphabetQuiz");
        if (!orderBlock) return res.status(404).json({ error: "Quiz not found" });

        const pos = orderBlock.letters.indexOf(questionId) + 1;
        if (pos === 0) return res.status(404).json({ error: "Question not found" });

        isCorrect = parseInt(answer) === pos;
        break;

      case "tf":
        const tfBlock = lesson.content.find(b => b.type === "tf");
        if (!tfBlock) return res.status(404).json({ error: "Quiz not found" });

        const tfQuestion = tfBlock.questions.find(q => q.id === questionId);
        if (!tfQuestion) return res.status(404).json({ error: "Question not found" });

        isCorrect = answer === tfQuestion.correct;
        break;

      default:
        return res.status(400).json({ error: "Unknown block type" });
    }

    res.json({ correct: isCorrect });
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
