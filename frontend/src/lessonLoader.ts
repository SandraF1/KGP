// src/lessonLoader.ts
import { FC } from "react";
import U1L1 from "./lessons/U1L1";
import U1L2 from "./lessons/U1L2";
import U2L1 from "./lessons/U2L1";

export interface LessonComponent {
  component: FC;
}

export interface Unit {
  title: string;
  subunits: LessonComponent[];
}

export const unitsData: Unit[] = [
  { title: "Unit 1", subunits: [{ component: U1L1 }, { component: U1L2 }] },
  { title: "Unit 2", subunits: [{ component: U2L1 }] },
];
