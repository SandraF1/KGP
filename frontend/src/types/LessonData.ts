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

// --- Alphabet Naming Block ---
export interface AlphabetNamingRow {
  symbol: string;
  answer: string;
}

export interface AlphabetNamingBlock {
  type: "alphabetNaming";
  headers: string[];
  rows: {
    symbol: string;
    answer: string;
  }[]; // now each row is an object, not a simple string[]
  instruction?: string; // optional field for instructions
}

// --- Alphabet Quiz Block ---
// --- Alphabet Quiz Block ---
export interface AlphabetQuizRow {
  letter: string;
  position: number;
}

export interface AlphabetQuizBlock {
  type: "alphabetQuiz";
  letters: AlphabetQuizRow[];   // ✅ FIXED
  numItems: number;
  instructions?: string;
}


// --- True / False Block ---
export interface TFQuestion {
  id: number;
  text: string;
  correct: boolean;
}

export interface TFBlock {
  type: "tf";
  questions: TFQuestion[];
}

// --- Diphthong Drag & Drop Block ---
export interface DiphthongDragDropBlock {
  type: "diphthongDragDrop";
  instructions: string;
  answers?: string[]; // optional, for backend checking
}

// --- Union of all block types ---
export type ContentBlock =
  | ParagraphBlock
  | ExampleBlock
  | TableBlock
  | HiddenTableBlock
  | AlphabetQuizBlock
  | AlphabetNamingBlock
  | TFBlock
  | DiphthongDragDropBlock;

// --- Lesson Data ---
export interface LessonData {
  id: string;
  title: string;
  content?: ContentBlock[];
}
