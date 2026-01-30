// backend/server.js

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

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
    if (err.code === "ENOENT") return null;
    throw err;
  }
}

// ---------------------------
// Routes
// ---------------------------

// 1️⃣ Get all units
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

// 2️⃣ Get lesson content by ID (correct answers removed)
app.get("/api/lessons/:id", async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lessonFile = path.join(__dirname, "data/lessons", `${lessonId}.json`);
    const lesson = await readJSON(lessonFile);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    if (lesson.content) {
      lesson.content = lesson.content.map(block => {
        if (block.type === "alphabetNaming")
          return { ...block, rows: block.rows };

        if (block.type === "alphabetQuiz")
          return { ...block, letters: block.letters };

        if (block.type === "tf")
          return {
            ...block,
            questions: block.questions.map(q => ({
              id: q.id,
              text: q.text
            }))
          };

        return block;
      });
    }

    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read lesson data" });
  }
});

// 3️⃣ Check answer (secure)
app.post("/api/check-answer", async (req, res) => {
  try {
    const { lessonId, blockType, questionId, answer } = req.body;
    if (!lessonId || !blockType || questionId === undefined || answer === undefined) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const lessonFile = path.join(__dirname, "data/lessons", `${lessonId}.json`);
    const lesson = await readJSON(lessonFile);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    let isCorrect = false;

    switch (blockType) {
      case "alphabetNaming": {
        const namingBlock = lesson.content.find(b => b.type === "alphabetNaming");
        if (!namingBlock) return res.status(404).json({ error: "Quiz not found" });

        const row = namingBlock.rows.find(r => r[0].trim() === String(questionId).trim());
        if (!row) return res.status(404).json({ error: "Question not found" });

        const correctAnswer = row[1].trim();
        isCorrect = String(answer).trim() === correctAnswer;
        break;
      }

      case "alphabetQuiz": {
        const orderBlock = lesson.content.find(b => b.type === "alphabetQuiz");
        if (!orderBlock) return res.status(404).json({ error: "Quiz not found" });

        const pos = orderBlock.letters.indexOf(String(questionId)) + 1;
        if (pos === 0) return res.status(404).json({ error: "Question not found" });

        isCorrect = parseInt(answer) === pos;
        break;
      }

      case "tf": {
        const tfBlock = lesson.content.find(b => b.type === "tf");
        if (!tfBlock) return res.status(404).json({ error: "Quiz not found" });

        const tfQuestion = tfBlock.questions.find(q => q.id.toString() === String(questionId));
        if (!tfQuestion) return res.status(404).json({ error: "Question not found" });

        isCorrect = answer === tfQuestion.correct;
        break;
      }

      default:
        return res.status(400).json({ error: "Unknown block type" });
    }

    res.json({ correct: isCorrect });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check answer" });
  }
});

// 4️⃣ Show correct answers (secure, supports ALL quiz types)
app.post("/api/show-answers", async (req, res) => {
  try {
    const { lessonId } = req.body;
    if (!lessonId) return res.status(400).json({ error: "Missing lessonId" });

    const lessonFile = path.join(__dirname, "data/lessons", `${lessonId}.json`);
    const lesson = await readJSON(lessonFile);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    const answers = {};

    for (const block of lesson.content) {
      if (block.type === "tf") {
        answers.tf = {};
        block.questions.forEach(q => {
          answers.tf[q.id] = q.correct;
        });
      }

      if (block.type === "alphabetNaming") {
        answers.alphabetNaming = {};
        block.rows.forEach(row => {
          answers.alphabetNaming[row[0]] = row[1];
        });
      }

      if (block.type === "alphabetQuiz") {
        answers.alphabetQuiz = {};
        block.letters.forEach((letter, index) => {
          answers.alphabetQuiz[letter] = index + 1;
        });
      }
    }

    res.json({ answers });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch correct answers" });
  }
});

// ---------------------------
// Start server
// ---------------------------
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
