import React, { useState } from "react";
import { LessonData } from "../api";

interface Props {
  lesson: LessonData;
  checkAnswer: (lessonId: string, question: string, answer: string) => Promise<{ correct: boolean }>;
}

const LessonViewer: React.FC<Props> = ({ lesson, checkAnswer }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleAnswer = async (qIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: answer }));

    if (!lesson.quiz) return;

    const question = lesson.quiz[qIndex].question;
    const res = await checkAnswer(lesson.id, question, answer);
    setResults(prev => ({ ...prev, [qIndex]: res.correct }));
  };

  return (
    <div>
      <h2>{lesson.title}</h2>
      <p>{lesson.text}</p>

      {lesson.quiz?.map((q, idx) => (
        <div key={idx}>
          <p>{q.question}</p>
          {q.options.map(opt => (
            <button key={opt} onClick={() => handleAnswer(idx, opt)}>
              {opt}
            </button>
          ))}
          {selectedAnswers[idx] && (
            <div>
              {results[idx] ? "✅ Correct!" : "❌ Try again"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LessonViewer;
