// src/types/LessonData.ts
export interface LessonData {
  text: string;
  quiz?: {
    type: string;
    question: string;
    options: string[];
    answer: string;
  }[];
}
