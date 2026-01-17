// src/components/LessonViewer.tsx
import React, { useState, useEffect } from "react";
import { LessonData, ConceptCheckItem, QuizItem } from "../types/LessonData";

interface Props {
  lesson: LessonData;
  checkAnswer?: (
    lessonId: string,
    question: string,
    answer: string
  ) => Promise<{ correct: boolean }>;
}

interface ConceptQuestion extends ConceptCheckItem {
  options: string[];
}

const LessonViewer: React.FC<Props> = ({ lesson, checkAnswer }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const [conceptQuestions, setConceptQuestions] = useState<ConceptQuestion[]>([]);

  // -------------------------------
  // Helper: shuffle array
  // -------------------------------
  const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

  // -------------------------------
  // Prepare concept-check questions (7 random letters + 3 options each)
  // -------------------------------
  useEffect(() => {
    if (!lesson.items || lesson.items.length === 0) return;

    const items = lesson.items;
    const selected = shuffle(items).slice(0, 7); // max 7 items

    const prepared: ConceptQuestion[] = selected.map((item) => {
      const otherNames = items
        .filter((i) => i.name !== item.name)
        .map((i) => i.name);

      const options = shuffle([item.name, ...shuffle(otherNames).slice(0, 2)]);
      return { ...item, options };
    });

    setConceptQuestions(prepared);
    setSelectedAnswers({});
    setScore(null);
    setChecked(false);
  }, [lesson.items]);

  // -------------------------------
  // MCQ answer handler
  // -------------------------------
  const handleAnswer = async (qIndex: number, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: answer }));

    if (!lesson.quiz || !checkAnswer) return;

    const question = lesson.quiz[qIndex].question;
    const res = await checkAnswer(lesson.id, question, answer);
    setResults((prev) => ({ ...prev, [qIndex]: res.correct }));
  };

  // -------------------------------
  // Concept-check selection
  // -------------------------------
  const handleSelectItem = (i: number, name: string) => {
    if (score === null) setSelectedAnswers((prev) => ({ ...prev, [i]: name }));
  };

  const handleSubmitItems = () => {
    let s = 0;
    conceptQuestions.forEach((item, i) => {
      if (selectedAnswers[i] === item.name) s++;
    });
    setScore(s);
    setChecked(true);
  };

  // -------------------------------
  // Button classes for styling
  // -------------------------------
  const getButtonClass = (value: string, correct: string, index: number): string => {
    if (!checked) {
      return selectedAnswers[index] === value
        ? "btn btn-warning me-2 mb-2"
        : "btn btn-outline-primary me-2 mb-2";
    }
    if (value === correct) return "btn btn-success me-2 mb-2";
    if (selectedAnswers[index] === value && value !== correct)
      return "btn btn-danger me-2 mb-2";
    return "btn btn-outline-secondary me-2 mb-2";
  };

  return (
    <div className="lesson-viewer">
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

      {/* Multiple-choice quiz */}
      {lesson.quiz?.map((q: QuizItem, idx: number) => (
        <div key={idx} className="quiz-item mb-3 p-3 border rounded">
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

      {/* Concept-check questions */}
      {conceptQuestions.map((item, i) => (
        <div key={i} className="concept-check mb-3 p-3 border rounded">
          <div className="fw-bold mb-2 fs-1">{item.letter}</div>
          <div>
            {item.options.map((name) => (
              <button
                key={name}
                type="button"
                className={getButtonClass(name, item.name, i)}
                onClick={() => handleSelectItem(i, name)}
                disabled={score !== null}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Submit button for concept-check */}
      {conceptQuestions.length > 0 && (
        <div className="mt-3">
          <button
            className="btn btn-primary me-2"
            onClick={handleSubmitItems}
            disabled={score !== null}
          >
            Submit
          </button>
        </div>
      )}

      {/* Score display */}
      {score !== null && (
        <div className="mt-3 text-center">
          <h3 className="display-5 fw-bold">
            Score: {score} / {conceptQuestions.length}
          </h3>
        </div>
      )}
    </div>
  );
};

export default LessonViewer;
