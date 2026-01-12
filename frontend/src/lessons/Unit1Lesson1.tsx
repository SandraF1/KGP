import React, { useEffect, useState } from "react";
import { fetchLessonContent } from "../api";

interface LessonData {
  text: string;
  quiz?: {
    type: string;
    question: string;
    options: string[];
    answer: string;
  }[];
}

const Unit1Lesson1: React.FC = () => {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    fetchLessonContent("U1L1").then(setLesson);
  }, []);

  if (!lesson) return <div>Loading lesson...</div>;

  return (
    <div>
      <h2>Alphabet & Pronunciation</h2>
      <p>{lesson.text}</p>

      {lesson.quiz?.map((q, idx) => (
        <div key={idx} style={{ marginTop: "20px" }}>
          <p>{q.question}</p>
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedAnswer(opt)}
              style={{ marginRight: "10px" }}
            >
              {opt}
            </button>
          ))}
          {selectedAnswer && (
            <div>
              {selectedAnswer === q.answer ? "✅ Correct!" : "❌ Try again"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Unit1Lesson1;
