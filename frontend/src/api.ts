// frontend/src/api.ts

export interface LessonData {
  id: string;
  title: string;
  text: string;
  quiz?: {
    question: string;
    options: string[];
  }[];
}

export interface UnitData {
  title: string;
  subunits: { id: string; title: string }[];
}

const BASE_URL = "http://localhost:5000/api";

// Fetch all units
export async function fetchUnits(): Promise<UnitData[]> {
  const res = await fetch(`${BASE_URL}/units`);
  if (!res.ok) throw new Error("Failed to fetch units");
  return res.json();
}

// Fetch lesson content by ID
export async function fetchLessonContent(id: string): Promise<LessonData> {
  const res = await fetch(`${BASE_URL}/lessons/${id}`);
  if (!res.ok) throw new Error("Failed to fetch lesson");
  return res.json();
}

// Send answer to backend for validation
export async function checkAnswer(
  lessonId: string,
  question: string,
  answer: string
): Promise<{ correct: boolean }> {
  const res = await fetch(`${BASE_URL}/check-answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lessonId, question, answer }),
  });

  if (!res.ok) throw new Error("Failed to check answer");
  return res.json();
}
