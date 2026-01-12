import React, { useState } from "react";
import { LessonData } from "../lessonLoader";
import { checkAnswer } from "../api";

interface Props {
  lesson: LessonData;
}

const LessonViewer: React.FC<Props> = ({ lesson }) => {
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const handleAnswer = async (question: string, answer: string) => {
    const result = await checkAnswer(lesson.id, question, answer);
    setFeedback(prev => ({ ...prev, [question]: result.correct ? "✅ Correct!" : "❌ Try again" }));
  };

  return (
    <div>
      <h2>{lesson.title}</h2>
      <p>{lesson.text}</p>
      {lesson.quiz?.map((q, idx) => (
        <div key={idx}>
          <p>{q.question}</p>
          {q.options.map(opt => (
            <button key={opt} onClick={() => handleAnswer(q.question, opt)}>
              {opt}
            </button>
          ))}
          {feedback[q.question] && <div>{feedback[q.question]}</div>}
        </div>
      ))}
    </div>
  );
};

export default LessonViewer;
