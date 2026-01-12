// src/lessons/U1L1.tsx
import React, { useState } from "react";

const U1L1: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const text = "Welcome to Unit 1 Lesson 1: Alphabet & Pronunciation.";
  const quiz = [
    { question: "What is the first letter of the Greek alphabet?", options: ["Alpha", "Beta", "Gamma"], answer: "Alpha" },
  ];

  return (
    <div>
      <h2>Unit 1 Lesson 1</h2>
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

export default U1L1;
