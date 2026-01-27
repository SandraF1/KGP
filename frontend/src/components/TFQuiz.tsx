import React, { useState } from "react";

export interface TFQuestion {
  id: number;
  text: string;
  correct: boolean;
}

interface Props {
  block: {
    type: "tf";
    questions: TFQuestion[];
  };
}

const TFQuiz: React.FC<Props> = ({ block }) => {
  const [answers, setAnswers] = useState<Record<number, boolean | "">>(
    Object.fromEntries(block.questions.map(q => [q.id, ""]))
  );
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState("");

  const handleChange = (id: number, value: boolean) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleCheck = () => {
    const correct = block.questions.filter(q => answers[q.id] === q.correct).length;
    setResult(`You got ${correct} out of ${block.questions.length} correct.`);
    setChecked(true);
  };

  const handleShow = () => {
    const shown = Object.fromEntries(block.questions.map(q => [q.id, q.correct]));
    setAnswers(shown);
    setResult("Correct answers are filled in.");
    setChecked(true);
  };

  const handleClear = () => {
    setAnswers(Object.fromEntries(block.questions.map(q => [q.id, ""])));
    setResult("");
    setChecked(false);
  };

  return (
    <section>
      <h3>Concept Check</h3>
      {block.questions.map(q => (
        <div key={q.id}>
          <p>{q.text}</p>
          <label>
            <input
              type="radio"
              name={`tf-${q.id}`}
              value="true"
              checked={answers[q.id] === true}
              onChange={() => handleChange(q.id, true)}
            />
            True
          </label>
          <label style={{ marginLeft: "0.5rem" }}>
            <input
              type="radio"
              name={`tf-${q.id}`}
              value="false"
              checked={answers[q.id] === false}
              onChange={() => handleChange(q.id, false)}
            />
            False
          </label>
        </div>
      ))}
      <div style={{ marginTop: "0.5rem" }}>
        <button onClick={handleCheck}>Check Answers</button>
        <button onClick={handleShow} style={{ marginLeft: "0.5rem" }}>Show Answers</button>
        <button onClick={handleClear} style={{ marginLeft: "0.5rem" }}>Clear</button>
      </div>
      {result && <div><strong>{result}</strong></div>}
    </section>
  );
};

export default TFQuiz;
