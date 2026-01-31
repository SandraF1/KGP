import React, { useState, useEffect } from "react";
import { checkAnswer, fetchCorrectAnswers } from "../api";

interface AlphabetOrderingQuizBlock {
  id?: string;
  type: "alphabetQuiz";
  letters: { letter: string; position: number }[]; // updated shape
  numItems: number;
  instructions?: string;
}

interface Props {
  lessonId: string;
  block: AlphabetOrderingQuizBlock;
}

interface QuizItem {
  letter: string;
  position: number; // correct position from backend
  userAnswer: string;
  feedback?: boolean;
}

const AlphabetOrderingQuiz: React.FC<Props> = ({ lessonId, block }) => {
  // Initialize quiz items once
const [items, setItems] = useState<QuizItem[]>(() => {
  if (!block.letters || block.letters.length === 0) return [];

  // 1️⃣ Shuffle all letters
  const shuffled = [...block.letters].sort(() => Math.random() - 0.5);

  // 2️⃣ Take only numItems (default to 7)
  const count = block.numItems ?? 7;

  const selected = shuffled.slice(0, count).map(l => ({
    letter: l.letter,
    position: l.position,
    userAnswer: "",
  }));

  console.log("🚀 AlphabetOrderingQuiz initialized items:", selected);
  return selected;
});


  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("🚀 AlphabetOrderingQuiz mounted", lessonId, block.id, items);
  }, []);

  const handleChange = (idx: number, value: string) => {
    setItems(prev => {
      const updated = [...prev];
      updated[idx].userAnswer = value;
      return updated;
    });
  };

  const handleCheck = async () => {
    setLoading(true);
    const newItems = [...items];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.userAnswer) continue;

      try {
        const res = await checkAnswer({
          lessonId,
          blockType: "alphabetQuiz",
          questionId: item.letter,
          answer: item.userAnswer,
        });

        newItems[i].feedback = res.correct;
      } catch (err) {
        console.error("Check answer failed:", err);
        newItems[i].feedback = false;
      }
    }

    setItems(newItems);
    setChecked(true);
    setLoading(false);
  };

  const handleShow = async () => {
    setLoading(true);
    try {
      const res = await fetchCorrectAnswers(lessonId);
      const correctMap: Record<string, number> = res.answers.alphabetQuiz || {};

      setItems(prev =>
        prev.map(i => ({
          ...i,
          userAnswer: correctMap[i.letter]?.toString() || "",
          feedback: true,
        }))
      );

      setChecked(true);
    } catch (err) {
      console.error("Failed to fetch correct answers:", err);
    }
    setLoading(false);
  };

  const handleClear = () => {
    setItems(prev =>
      prev.map(i => ({ ...i, userAnswer: "", feedback: undefined }))
    );
    setChecked(false);
  };

  return (
    <section>
      <h3>Alphabet Ordering Quiz</h3>
      {block.instructions && <p>{block.instructions}</p>}

      {items.map((item, idx) => (
        <div key={item.letter} style={{ marginBottom: "0.5rem" }}>
          <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
            {idx + 1}. {item.letter}
          </span>

          <input
            type="number"
            min={1}
            max={block.letters.length}
            value={item.userAnswer}
            onChange={e => handleChange(idx, e.target.value)}
            style={{
              borderColor: checked
                ? item.feedback
                  ? "green"
                  : "red"
                : "#ccc",
            }}
          />

          {checked && item.feedback !== undefined && (
            <span style={{ marginLeft: "0.5rem" }}>
              {item.feedback ? "✅" : "❌"}
            </span>
          )}
        </div>
      ))}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleCheck} disabled={loading}>
          {loading ? "Checking..." : "Check Answers"}
        </button>

        <button onClick={handleShow} style={{ marginLeft: "0.5rem" }} disabled={loading}>
          Show Answers
        </button>

        <button onClick={handleClear} style={{ marginLeft: "0.5rem" }}>
          Clear
        </button>
      </div>
    </section>
  );
};

export default AlphabetOrderingQuiz;
