// src/lessons/U1L2.tsx
import React, { useState } from "react";

const U1L2: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const text = "Unit 1 Lesson 2: Simple Words & Greetings.";
  const quiz = [
    { question: "How do you say 'Hello' in Greek?", options: ["Γειά", "Χαίρετε", "Καλημέρα"], answer: "Γειά" },
  ];

  return (
    <div>
      <h2>Unit 1 Lesson 2</h2>
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

export default U1L2;

