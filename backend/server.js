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
// Routes
// ---------------------------

// Get all units with their lesson metadata
app.get("/api/units", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data/units.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read units data" });
  }
});

// Get lesson content by ID
app.get("/api/lessons/:id", (req, res) => {
  try {
    const lessonId = req.params.id;
    const filePath = path.join(__dirname, "data/lessons", `${lessonId}.json`);

    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      res.json(data);
    } else {
      res.status(404).json({ error: "Lesson not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read lesson data" });
  }
});

// ---------------------------
// Start server
// ---------------------------
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
