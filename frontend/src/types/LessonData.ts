// src/types/LessonData.ts

// Type for a single table cell
export interface TableCell {
  content: string;       // The text or HTML content of the cell
  rowSpan?: number;      // Optional row span
  colSpan?: number;      // Optional column span
}

// Type for a table
export interface LessonTable {
  headers: string[];       // Column headers
  rows: TableCell[][];     // Array of rows, each row is array of TableCells
}

// Type for a single quiz item
export interface QuizItem {
  type: string;            // e.g., "multiple-choice", "true-false"
  question: string;
  options: string[];
  answer: string;
}

// Main lesson type
export interface LessonData {
  id: string;               // Unique lesson ID
  title: string;            // Lesson title
  text: string;             // Lesson text/content
  table?: LessonTable;      // Optional table
  quiz?: QuizItem[];        // Optional quiz items
}
