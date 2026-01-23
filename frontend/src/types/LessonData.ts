// src/types/LessonData.ts
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

export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface ExampleBlock {
  type: "example";
  text: string;
}

export interface TableBlock {
  type: "table" | "hiddenTable";
  headers: string[];
  rows: string[][];
}

export interface AlphabetQuizBlock {
  type: "alphabetQuiz";
  letters: string[];
  numItems: number;
  instructions?: string;
}

export type ContentBlock =
  | ParagraphBlock
  | ExampleBlock
  | TableBlock
  | AlphabetQuizBlock;

export interface LessonData {
  id: string;
  title: string;
  content?: ContentBlock[];
}
