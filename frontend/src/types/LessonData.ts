export interface LessonTable {
  headers: string[];
  rows: string[][];
}

export interface QuizItem {
  question: string;
  options: string[];
  answer: string;
}

export interface LessonData {
  id: string;
  title: string;
  text: string;
  table?: LessonTable;
  quiz?: QuizItem[];
}
