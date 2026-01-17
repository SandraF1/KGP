// src/types/LessonData.ts

// Table structure
export interface LessonTable {
  headers: string[];      // Column headers
  rows: string[][];       // Each row is an array of strings
}

// Quiz structure
export interface QuizItem {
  question: string;
  options: string[];
  answer: string;
}

// Concept check item (e.g., Greek letter + name)
export interface ConceptCheckItem {
  letter: string;
  name: string;
}

// Main lesson type
export interface LessonData {
  id: string;                       // Unique lesson ID
  title: string;                    // Lesson title
  text: string;                     // Lesson text/content
  table?: LessonTable;              // Optional table
  quiz?: QuizItem[];                // Optional quiz (multiple choice)
  items?: ConceptCheckItem[];       // Optional concept-check items (for U1C1 style)
}
