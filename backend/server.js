// backend/server.js

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// ---------------------------
// Middleware
// ---------------------------
app.use(cors());
app.use(express.json());

// ---------------------------
// SQLite connection
// ---------------------------
const db = new Database(path.join(__dirname, "db/quiz.db"));

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

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
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

// 2️⃣ Get lesson content by ID (JSON + DB merge)
app.get("/api/lessons/:id", async (req, res) => {
  try {
    const lessonId = req.params.id;

    // JSON paragraphs
    const lessonFile = path.join(__dirname, "data/lessons", `${lessonId}.json`);
    const lessonJSON = await readJSON(lessonFile);
    if (!lessonJSON) return res.status(404).json({ error: "Lesson not found" });

    // Paragraph blocks with block_order
    const paragraphBlocks = lessonJSON.content
      .map((block, index) =>
        block.type === "paragraph" ? { ...block, block_order: index } : null,
      )
      .filter(Boolean);

    // Fetch interactive blocks from DB
    const interactiveBlocks = db
      .prepare(
        "SELECT * FROM content_block WHERE lesson_id = ? ORDER BY block_order",
      )
      .all(lessonId);

    const mergedInteractive = interactiveBlocks.map((block) => {
      let result = {
        block_order: block.block_order,
        type: block.block_type,
        instruction: block.instruction || "",
      };

      switch (block.block_type) {
        case "alphabetNaming": {
          const allRows = db
            .prepare(
              "SELECT symbol, answer FROM alphabet_naming_row WHERE content_block_id = ?",
            )
            .all(block.id);

          result.rows = shuffleArray(allRows).slice(0, 7); // pick 7 random letters
          break;
        }

        case "alphabetQuiz": {
          const letters = db
            .prepare(
              "SELECT letter, position FROM alphabet_quiz_row WHERE content_block_id = ? ORDER BY id",
            )
            .all(block.id);
          result.letters = shuffleArray(letters); // optional shuffle
          break;
        }

        case "diphthongDragDrop": {
          const answers = db
            .prepare(
              "SELECT answer FROM diphthong_dragdrop_row WHERE content_block_id = ?",
            )
            .all(block.id)
            .map((r) => r.answer);
          result.answers = answers;
          break;
        }

        case "tf": {
          const questions = db
            .prepare(
              "SELECT question_id as id, text, correct FROM tf_question WHERE content_block_id = ? ORDER BY question_id",
            )
            .all(block.id)
            .map((q) => ({ ...q, correct: !!q.correct }));
          result.questions = questions;
          break;
        }

        default:
          break;
      }

      return result;
    });

    // Merge paragraphs + interactive blocks and sort
    const mergedContent = [...paragraphBlocks, ...mergedInteractive].sort(
      (a, b) => a.block_order - b.block_order,
    );

    res.json({
      id: lessonId,
      title: lessonJSON.title,
      content: mergedContent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch lesson data" });
  }
});

// 3️⃣ Check standard quiz answer
app.post("/api/check-answer", (req, res) => {
  try {
    const { lessonId, blockType, questionId, answer } = req.body;
    if (
      !lessonId ||
      !blockType ||
      questionId === undefined ||
      answer === undefined
    ) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    let isCorrect = false;

    switch (blockType) {
      case "alphabetNaming": {
        const row = db
          .prepare(
            `
          SELECT an.answer
          FROM alphabet_naming_row an
          JOIN content_block cb ON cb.id = an.content_block_id
          WHERE cb.lesson_id = ? AND cb.block_type = ? AND an.symbol = ?
        `,
          )
          .get(lessonId, blockType, questionId);

        if (!row) return res.status(404).json({ error: "Question not found" });
        isCorrect = String(row.answer).trim() === String(answer).trim();
        break;
      }

      case "alphabetQuiz": {
        const letters = db
          .prepare(
            `
          SELECT letter, position
          FROM alphabet_quiz_row aq
          JOIN content_block cb ON cb.id = aq.content_block_id
          WHERE cb.lesson_id = ? AND cb.block_type = ?
          ORDER BY aq.id
        `,
          )
          .all(lessonId, blockType);

        const posObj = letters.find((l) => l.letter === String(questionId));
        if (!posObj)
          return res.status(404).json({ error: "Question not found" });

        isCorrect = parseInt(answer) === posObj.position;
        break;
      }

      case "tf": {
        const tfRow = db
          .prepare(
            `
          SELECT tq.correct
          FROM tf_question tq
          JOIN content_block cb ON cb.id = tq.content_block_id
          WHERE cb.lesson_id = ? AND cb.block_type = ? AND tq.question_id = ?
        `,
          )
          .get(lessonId, blockType, questionId);

        if (!tfRow)
          return res.status(404).json({ error: "Question not found" });
        isCorrect = !!tfRow.correct === answer;
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

// 4️⃣ Check DiphthongDragDrop answers
app.post("/api/check-diphthong", (req, res) => {
  try {
    const { lessonId, attempt } = req.body;
    if (!lessonId || !attempt || attempt.trim() === "")
      return res.status(400).json({ error: "Missing parameters" });

    const answers = db
      .prepare(
        `
      SELECT ddd.answer
      FROM diphthong_dragdrop_row ddd
      JOIN content_block cb ON cb.id = ddd.content_block_id
      WHERE cb.lesson_id = ? AND cb.block_type = 'diphthongDragDrop'
    `,
      )
      .all(lessonId)
      .map((r) => r.answer);

    res.json({ correct: answers.includes(attempt) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check diphthong answer" });
  }
});

// 5️⃣ Show correct answers
app.post("/api/show-answers", (req, res) => {
  try {
    const { lessonId } = req.body;
    if (!lessonId) return res.status(400).json({ error: "Missing lessonId" });

    const blocks = db
      .prepare(
        "SELECT * FROM content_block WHERE lesson_id = ? ORDER BY block_order",
      )
      .all(lessonId);

    const answers = {};

    blocks.forEach((block) => {
      switch (block.block_type) {
        case "alphabetNaming":
          const an = db
            .prepare(
              "SELECT symbol, answer FROM alphabet_naming_row WHERE content_block_id = ?",
            )
            .all(block.id);
          answers.alphabetNaming = Object.fromEntries(
            an.map((r) => [r.symbol, r.answer]),
          );
          break;

        case "alphabetQuiz":
          const aq = db
            .prepare(
              "SELECT letter, position FROM alphabet_quiz_row WHERE content_block_id = ? ORDER BY id",
            )
            .all(block.id);
          answers.alphabetQuiz = Object.fromEntries(
            aq.map((r) => [r.letter, r.position]),
          );
          break;

        case "diphthongDragDrop":
          const dd = db
            .prepare(
              "SELECT answer FROM diphthong_dragdrop_row WHERE content_block_id = ?",
            )
            .all(block.id);
          answers.diphthongDragDrop = dd.map((r) => r.answer);
          break;

        case "tf":
          const tf = db
            .prepare(
              "SELECT question_id as id, correct FROM tf_question WHERE content_block_id = ?",
            )
            .all(block.id);
          answers.tf = Object.fromEntries(tf.map((r) => [r.id, !!r.correct]));
          break;
      }
    });

    res.json({ answers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch answers" });
  }
});

// ---------------------------
// Start server
// ---------------------------
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
