// backend/seed.js
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ---------------------------
// Fix __dirname in ES module
// ---------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------
// Connect to SQLite DB
// ---------------------------
const db = new Database(path.join(__dirname, "db/quiz.db"));

// ---------------------------
// 1️⃣ Create tables if they don't exist
// ---------------------------
db.exec(`
CREATE TABLE IF NOT EXISTS lesson (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS content_block (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id TEXT NOT NULL,
  block_type TEXT NOT NULL,
  block_order INTEGER NOT NULL,
  instruction TEXT,
  FOREIGN KEY (lesson_id) REFERENCES lesson(id)
);

CREATE TABLE IF NOT EXISTS alphabet_naming_row (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_block_id INTEGER NOT NULL,
  symbol TEXT NOT NULL,
  answer TEXT NOT NULL,
  FOREIGN KEY (content_block_id) REFERENCES content_block(id)
);

CREATE TABLE IF NOT EXISTS alphabet_quiz_row (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_block_id INTEGER NOT NULL,
  letter TEXT NOT NULL,
  position INTEGER,
  FOREIGN KEY (content_block_id) REFERENCES content_block(id)
);

CREATE TABLE IF NOT EXISTS diphthong_dragdrop_row (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_block_id INTEGER NOT NULL,
  answer TEXT NOT NULL,
  FOREIGN KEY (content_block_id) REFERENCES content_block(id)
);

CREATE TABLE IF NOT EXISTS tf_question (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_block_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  FOREIGN KEY (content_block_id) REFERENCES content_block(id)
);
`);

// ---------------------------
// 2️⃣ Read lesson JSON files
// ---------------------------
const lessonsFolder = path.join(__dirname, "data/lessons");
const files = fs.readdirSync(lessonsFolder).filter((f) => f.endsWith(".json"));

files.forEach((file) => {
  const lessonJSON = JSON.parse(
    fs.readFileSync(path.join(lessonsFolder, file), "utf8"),
  );

  // Extract first paragraph as default instruction
  const instructionBlock = lessonJSON.content.find(
    (b) => b.type === "paragraph",
  );
  const defaultInstruction = instructionBlock ? instructionBlock.text : "";

  // Only keep interactive blocks
  const interactiveTypes = [
    "alphabetNaming",
    "alphabetQuiz",
    "diphthongDragDrop",
    "tf",
  ];
  const interactiveBlocks = lessonJSON.content.filter((b) =>
    interactiveTypes.includes(b.type),
  );
  if (interactiveBlocks.length === 0) return;

  // Insert lesson
  db.prepare("INSERT OR IGNORE INTO lesson (id, title) VALUES (?, ?)").run(
    lessonJSON.id,
    lessonJSON.title,
  );

  // Insert interactive blocks
  interactiveBlocks.forEach((block, index) => {
    const instructionTextForBlock =
      block.instruction || block.instructions || defaultInstruction;

    const result = db
      .prepare(
        "INSERT OR IGNORE INTO content_block (lesson_id, block_type, block_order, instruction) VALUES (?, ?, ?, ?)",
      )
      .run(lessonJSON.id, block.type, index, instructionTextForBlock);

    const blockId = result.lastInsertRowid;

    switch (block.type) {
      case "alphabetNaming":
        const stmtAN = db.prepare(
          "INSERT OR IGNORE INTO alphabet_naming_row (content_block_id, symbol, answer) VALUES (?, ?, ?)",
        );
        block.rows?.forEach((row) => {
          if (row?.symbol && row?.answer)
            stmtAN.run(blockId, row.symbol, row.answer);
        });
        break;

      case "alphabetQuiz":
        const stmtAQ = db.prepare(
          "INSERT OR IGNORE INTO alphabet_quiz_row (content_block_id, letter, position) VALUES (?, ?, ?)",
        );
        block.letters?.forEach((letter, i) => {
          if (letter) stmtAQ.run(blockId, letter, i + 1);
        });
        break;

      case "diphthongDragDrop":
        const stmtDD = db.prepare(
          "INSERT OR IGNORE INTO diphthong_dragdrop_row (content_block_id, answer) VALUES (?, ?)",
        );
        block.answers?.forEach((answer) => {
          if (answer) stmtDD.run(blockId, answer);
        });
        break;

      case "tf":
        const stmtTF = db.prepare(
          "INSERT OR IGNORE INTO tf_question (content_block_id, question_id, text, correct) VALUES (?, ?, ?, ?)",
        );
        block.questions?.forEach((q) => {
          if (
            q?.id !== undefined &&
            q?.text !== undefined &&
            q.correct !== undefined
          )
            stmtTF.run(blockId, q.id, q.text, q.correct ? 1 : 0);
        });
        break;
    }
  });

  console.log(`✅ Interactive lesson ${lessonJSON.id} seeded`);
});

console.log("🎉 All interactive lessons seeded successfully!");
