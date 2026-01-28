// src/components/TFQuiz.tsx
import React, { useState } from "react";
import { TFBlock } from "../types/LessonData";

interface Props {
  block: TFBlock;
}

const TFQuiz: React.FC<Props> = ({ block }) => {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>(
    () => Object.fromEntries(block.questions.map(q => [q.id, null]))
  );
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState("");

  const handleChange = (id: number, value: boolean) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleCheck = () => {
    const correctCount = block.questions.filter(q => answers[q.id] === q.correct).length;
    setResult(`You got ${correctCount} out of ${block.questions.length} correct.`);
    setChecked(true);
  };

  const handleShow = () => {
    const correctAnswers = Object.fromEntries(block.questions.map(q => [q.id, q.correct]));
    setAnswers(correctAnswers);
    setResult("Correct answers are filled in.");
    setChecked(true);
  };

  const handleClear = () => {
    setAnswers(Object.fromEntries(block.questions.map(q => [q.id, null])));
    setResult("");
    setChecked(false);
  };

  return (
    <section>
      <h3>True / False</h3>
      {block.questions.map((q, idx) => (
        <div key={q.id} style={{ marginBottom: "0.5rem" }}>
          {/* Number added here */}
          <p>{idx + 1}. {q.text}</p>
          <label>
            <input
              type="radio"
              name={`tf-${q.id}`}
              value="true"
              checked={answers[q.id] === true}
              onChange={() => handleChange(q.id, true)}
            /> True
          </label>
          <label style={{ marginLeft: "1rem" }}>
            <input
              type="radio"
              name={`tf-${q.id}`}
              value="false"
              checked={answers[q.id] === false}
              onChange={() => handleChange(q.id, false)}
            /> False
          </label>
        </div>
      ))}
      <div style={{ marginTop: "0.5rem" }}>
        <button onClick={handleCheck}>Check Answers</button>
        <button onClick={handleShow} style={{ marginLeft: "0.5rem" }}>Show Answers</button>
        <button onClick={handleClear} style={{ marginLeft: "0.5rem" }}>Clear</button>
      </div>
      {result && <div style={{ marginTop: "0.5rem" }}><strong>{result}</strong></div>}
    </section>
  );
};

export default TFQuiz;
