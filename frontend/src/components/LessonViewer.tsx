import React, { useState } from "react";
import { LessonData } from "../api";

interface Props {
  lesson: LessonData;
  checkAnswer: (
    lessonId: string,
    question: string,
    answer: string
  ) => Promise<{ correct: boolean }>;
}

const LessonViewer: React.FC<Props> = ({ lesson, checkAnswer }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleAnswer = async (qIndex: number, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: answer }));

    if (!lesson.quiz) return;

    const question = lesson.quiz[qIndex].question;
    const res = await checkAnswer(lesson.id, question, answer);
    setResults((prev) => ({ ...prev, [qIndex]: res.correct }));
  };

  return (
    <div className="lesson-viewer">
      {/* Lesson title and text */}
      <h2>{lesson.title}</h2>
      <p>{lesson.text}</p>

      {/* Table rendering */}
      {lesson.table && (
        <table className="lesson-table">
          <thead>
            <tr>
              {lesson.table.headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lesson.table.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Quiz rendering */}
      {lesson.quiz?.map((q, idx) => (
        <div key={idx} className="quiz-item">
          <p>{q.question}</p>
          <div className="quiz-options">
            {q.options.map((opt) => (
              <button key={opt} onClick={() => handleAnswer(idx, opt)}>
                {opt}
              </button>
            ))}
          </div>
          {selectedAnswers[idx] && (
            <div className="quiz-feedback">
              {results[idx] ? "✅ Correct!" : "❌ Try again"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LessonViewer;
