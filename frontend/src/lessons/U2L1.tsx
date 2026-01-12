// src/lessons/U2L1.tsx
import React, { useState } from "react";

const U2L1: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const text = "Unit 2 Lesson 1: Basic Grammar.";
  const quiz = [
    { question: "What is the Greek word for 'man'?", options: ["ἀνήρ", "γυνή", "παῖς"], answer: "ἀνήρ" },
  ];

  return (
    <div>
      <h2>Unit 2 Lesson 1</h2>
      <p>{text}</p>
      {quiz.map((q, idx) => (
        <div key={idx}>
          <p>{q.question}</p>
          {q.options.map(opt => (
            <button key={opt} onClick={() => setSelectedAnswer(opt)}>{opt}</button>
          ))}
          {selectedAnswer && (selectedAnswer === q.answer ? "✅ Correct!" : "❌ Try again")}
        </div>
      ))}
    </div>
  );
};

export default U2L1;
