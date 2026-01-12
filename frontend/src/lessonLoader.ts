import { U1L1 } from "./lessons/U1L1";
import { U1L2 } from "./lessons/U1L2";
import { U2L1 } from "./lessons/U2L1";

export interface QuizItem {
  question: string;
  options: string[];
}

export interface LessonData {
  id: string;
  title: string;
  text: string;
  quiz?: QuizItem[];
}

export interface Unit {
  title: string;
  subunits: LessonData[];
}

export const unitsData: Unit[] = [
  { title: "Unit 1", subunits: [U1L1, U1L2] },
  { title: "Unit 2", subunits: [U2L1] }
];
