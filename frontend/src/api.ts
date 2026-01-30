// frontend/src/api.ts

export interface LessonData {
  id: string;
  title: string;
  text: string;
  content?: any[]; // paragraphs, TF blocks, alphabet quizzes, etc.
}

export interface UnitData {
  title: string;
  subunits: { id: string; title: string }[];
}

const BASE_URL = "http://localhost:5000/api";

// ---------------------------
// Fetch all units
// ---------------------------
export async function fetchUnits(): Promise<UnitData[]> {
  const res = await fetch(`${BASE_URL}/units`);
  if (!res.ok) throw new Error(`Failed to fetch units: ${res.statusText}`);
  return res.json();
}

// ---------------------------
// Fetch lesson content by ID
// ---------------------------
export async function fetchLessonContent(id: string): Promise<LessonData> {
  const res = await fetch(`${BASE_URL}/lessons/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch lesson ${id}: ${res.statusText}`);
  return res.json();
}

// ---------------------------
// Check a single quiz answer
// ---------------------------
export type BlockType = "alphabetNaming" | "alphabetQuiz" | "tf";

export interface CheckAnswerParams {
  lessonId: string;
  blockType: BlockType;
  questionId: string | number; // letter for alphabet quizzes, id for TF
  answer: string | boolean | number;
}

export interface CheckAnswerResult {
  correct: boolean;
}

export async function checkAnswer(params: CheckAnswerParams): Promise<CheckAnswerResult> {
  const res = await fetch(`${BASE_URL}/check-answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lessonId: params.lessonId,
      blockType: params.blockType,
      questionId: params.questionId.toString(),
      answer: params.answer,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to check answer: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json();
}

// ---------------------------
// Securely fetch correct answers for ALL quiz types
// ---------------------------
export interface ShowAnswersResponse {
  answers: {
    tf?: Record<string, boolean>;
    alphabetNaming?: Record<string, string>;
    alphabetQuiz?: Record<string, number>;
  };
}

export async function fetchCorrectAnswers(lessonId: string): Promise<ShowAnswersResponse> {
  const res = await fetch(`${BASE_URL}/show-answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lessonId }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch correct answers: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json();
}
