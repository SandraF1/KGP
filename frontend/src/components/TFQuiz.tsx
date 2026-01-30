// src/components/TFQuiz.tsx
import React, { useState } from "react";
import { TFBlock } from "../types/LessonData";
import { checkAnswer } from "../api";

interface Props {
  lessonId: string;
  block: TFBlock;
}

const TFQuiz: React.FC<Props> = ({ lessonId, block }) => {
  // Normalize questions so correct is always boolean
  const normalizedQuestions = block.questions.map((q) => ({
    ...q,
    correct: Boolean(q.correct),
  }));
console.log("RAW QUESTIONS:", block.questions);
console.log("NORMALIZED:", normalizedQuestions);



  // Answers: true / false / null (unanswered)
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(
    () =>
      Object.fromEntries(
        normalizedQuestions.map((q) => [q.id.toString(), null])
      )
  );

  // Feedback after check
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  // mode: none = nothing, check = show correct/incorrect for answered, show = show all correct answers
  const [mode, setMode] = useState<"none" | "check" | "show">("none");

  const handleChange = (id: number, value: boolean) => {
    const idStr = id.toString();
    setAnswers((prev) => ({ ...prev, [idStr]: value }));
  };

  const handleCheck = async () => {
    setLoading(true);
    const newFeedback: Record<string, boolean> = {};

    for (const q of normalizedQuestions) {
      const idStr = q.id.toString();
      const userAnswer = answers[idStr];

      if (userAnswer === null) continue; // skip unanswered

      try {
        const res = await checkAnswer({
          lessonId,
          blockType: "tf",
          questionId: idStr,
          answer: userAnswer,
        });
        newFeedback[idStr] = res.correct;
      } catch (err) {
        console.error("Failed to check answer", err);
        newFeedback[idStr] = false;
      }
    }

    setFeedback(newFeedback);
    setMode("check");
    setLoading(false);
  };

  const handleShow = () => {
    const correctAnswers: Record<string, boolean> = {};
    const fb: Record<string, boolean> = {};

    normalizedQuestions.forEach((q) => {
      const idStr = q.id.toString();
      correctAnswers[idStr] = q.correct; // set the correct choice
      fb[idStr] = true; // show green tick for each
    });

    setAnswers(correctAnswers);
    setFeedback(fb);
    setMode("show");
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
                checked={answerValue === true} // strict check
                onChange={() => handleChange(q.id, true)}
              />{" "}
              True
            </label>

            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                name={`tf-${idStr}`}
                checked={answerValue === false} // strict check
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
