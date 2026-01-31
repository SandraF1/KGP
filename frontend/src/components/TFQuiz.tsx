// src/components/TFQuiz.tsx
import React, { useState } from "react";
import { TFBlock } from "../types/LessonData";
import { checkAnswer, fetchCorrectAnswers } from "../api";

interface Props {
  lessonId: string;
  block: TFBlock;
}

const TFQuiz: React.FC<Props> = ({ lessonId, block }) => {
  // Normalize incoming questions (strip correct answer)
  const normalizedQuestions = block.questions.map((q) => ({
    id: q.id,
    text: q.text,
  }));

  // User answers: true / false / null
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(
    () =>
      Object.fromEntries(normalizedQuestions.map((q) => [q.id.toString(), null]))
  );

  // Feedback after checking answers
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  // Mode: "none" = not checked, "check" = show correct/incorrect, "show" = show all correct
  const [mode, setMode] = useState<"none" | "check" | "show">("none");

  const handleChange = (id: number, value: boolean) => {
    const idStr = id.toString();
    if (mode === "show") return; // disable changes when showing answers
    setAnswers((prev) => ({ ...prev, [idStr]: value }));
  };

  const handleCheck = async () => {
    setLoading(true);
    const newFeedback: Record<string, boolean> = {};

    for (const q of normalizedQuestions) {
      const idStr = q.id.toString();
      const userAnswer = answers[idStr];

      if (userAnswer === null) continue;

      try {
        const res = await checkAnswer({
          lessonId,
          blockType: "tf",
          questionId: idStr,
          answer: userAnswer,
        });

        newFeedback[idStr] = !!res.correct; // force boolean
      } catch (err) {
        console.error("Failed to check answer:", err);
        newFeedback[idStr] = false;
      }
    }

    setFeedback(newFeedback);
    setMode("check");
    setLoading(false);
  };

  // Show correct answers securely from backend
  const handleShow = async () => {
    try {
      const res = await fetchCorrectAnswers(lessonId);
      const correctMap = res.answers.tf || {};

      const correctAnswers: Record<string, boolean> = {};
      const fb: Record<string, boolean> = {};

      normalizedQuestions.forEach((q) => {
        const idStr = q.id.toString();
        correctAnswers[idStr] = !!correctMap[idStr]; // convert 0/1 to boolean
        fb[idStr] = true; // mark feedback as correct
      });

      setAnswers(correctAnswers);
      setFeedback(fb);
      setMode("show");
    } catch (err) {
      console.error("Failed to fetch correct answers:", err);
    }
  };

  const handleClear = () => {
    setAnswers(
      Object.fromEntries(normalizedQuestions.map((q) => [q.id.toString(), null]))
    );
    setFeedback({});
    setMode("none");
  };

  return (
    <section>
      <h3>True / False</h3>

      {normalizedQuestions.map((q, idx) => {
        const idStr = q.id.toString();
        const answerValue = answers[idStr];

        let icon: string | null = null;
        if (mode === "check") {
          if (answerValue !== null && feedback[idStr] !== undefined) {
            icon = feedback[idStr] ? "✅" : "❌";
          }
        } else if (mode === "show") {
          icon = "✅";
        }

        return (
          <div key={q.id} style={{ marginBottom: "0.75rem" }}>
            <p>
              {idx + 1}. {q.text} {icon && <strong>{icon}</strong>}
            </p>

            <label>
              <input
                type="radio"
                name={`tf-${idStr}`}
                checked={answerValue === true}
                disabled={mode === "show"}
                onChange={() => handleChange(q.id, true)}
              />{" "}
              True
            </label>

            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                name={`tf-${idStr}`}
                checked={answerValue === false}
                disabled={mode === "show"}
                onChange={() => handleChange(q.id, false)}
              />{" "}
              False
            </label>
          </div>
        );
      })}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleCheck} disabled={loading}>
          {loading ? "Checking..." : "Check Answers"}
        </button>

        <button onClick={handleShow} style={{ marginLeft: "0.5rem" }}>
          Show Answers
        </button>

        <button onClick={handleClear} style={{ marginLeft: "0.5rem" }}>
          Clear
        </button>
      </div>
    </section>
  );
};

export default TFQuiz;
