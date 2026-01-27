// src/types/LessonData.ts

// --- Table and Quiz Types ---
export interface LessonTable {
  headers: string[];
  rows: string[][];
}

export interface QuizItem {
  question: string;
  options: string[];
  answer: string;
}

export interface ConceptCheckItem {
  letter: string;
  name: string;
}

// --- Lesson Block Types ---
export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface ExampleBlock {
  type: "example";
  text: string;
}

export interface TableBlock {
  type: "table";
  headers: string[];
  rows: string[][];
}

export interface HiddenTableBlock {
  type: "hiddenTable";
  headers: string[];
  rows: string[][];
}

export interface AlphabetQuizBlock {
  type: "alphabetQuiz";
  letters: string[];
  numItems: number;
  instructions?: string;
}

export interface AlphabetNamingBlock {
  type: "alphabetNaming";
  headers: string[];
  rows: string[][];
}

export interface TFBlock {
  type: "tf";
  questions: {
    id: number;
    text: string;
    correct: boolean;
  }[];
}

// --- Union of all block types ---
export type ContentBlock =
  | ParagraphBlock
  | ExampleBlock
  | TableBlock
  | HiddenTableBlock
  | AlphabetQuizBlock
  | AlphabetNamingBlock
  | TFBlock;

// --- Lesson Data ---
export interface LessonData {
  id: string;
  title: string;
  content?: ContentBlock[];
}
