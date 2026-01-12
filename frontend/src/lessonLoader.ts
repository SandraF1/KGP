// frontend/src/lessonLoader.ts
export interface QuizQuestion {
  question: string;
  options: string[];
}

export interface LessonData {
  id: string;
  title: string;
  text: string;
  quiz?: QuizQuestion[];
}

// Fetch a single lesson
export async function fetchLesson(lessonId: string): Promise<LessonData> {
  const res = await fetch(`http://localhost:5000/api/lessons/${lessonId}`);
  if (!res.ok) throw new Error("Lesson not found");
  return res.json();
}

// Fetch all lessons metadata for sidebar
export async function fetchUnits() {
  const res = await fetch("http://localhost:5000/api/units");
  if (!res.ok) throw new Error("Units not found");
  return res.json();
}

// Validate answer
export async function checkAnswer(
  lessonId: string,
  question: string,
  answer: string
): Promise<{ correct: boolean }> {
  const res = await fetch("http://localhost:5000/api/check-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lessonId, question, answer })
  });
  return res.json();
}
