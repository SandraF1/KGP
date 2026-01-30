import React, { useState, useEffect } from "react";
import { checkAnswer } from "../api"; // adjust path if needed

export interface AlphabetNamingBlock {
  type: "alphabetNaming";
  headers?: string[];
  rows: string[][];
}

interface Props {
  lessonId: string;
  block: AlphabetNamingBlock;
}

interface ItemState {
  letter: string;
  options: string[];
  userAnswer: string;
  correctAnswer: string;
  feedback?: boolean;
}

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const AlphabetNamingQuiz: React.FC<Props> = ({ lessonId, block }) => {
  const [items, setItems] = useState<ItemState[]>([]);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!block.rows || block.rows.length === 0) return;

    const shuffledRows = shuffle(block.rows);
    const selectedRows = shuffledRows.slice(0, Math.min(7, block.rows.length));

    const allNames = block.rows.map(r => r[1]).filter(Boolean);

    const quizItems: ItemState[] = selectedRows.map(row => {
      const correctAnswer = row[1].trim();
      const wrongOptions = shuffle(allNames.filter(n => n !== correctAnswer)).slice(0, 3);
      return {
        letter: row[0].trim(),
        options: shuffle([correctAnswer, ...wrongOptions]),
        userAnswer: "",
        correctAnswer,
      };
    });

    setItems(quizItems);
    setChecked(false);
  }, [block]);

  const handleAnswer = (idx: number, value: string) => {
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
          blockType: "alphabetNaming",
          questionId: item.letter,      // ✅ send the actual letter, not index
          answer: item.userAnswer.trim() // ✅ trim whitespace
        });
        newItems[i].feedback = res.correct;
      } catch (err) {
        console.error("Check answer failed:", err);
      }
    }

    setItems(newItems);
    setChecked(true);
    setLoading(false);
  };

  const handleShow = () => {
    setItems(prev =>
      prev.map(i => ({ ...i, userAnswer: i.correctAnswer, feedback: true }))
    );
    setChecked(true);
  };

  const handleClear = () => {
    setItems(prev =>
      prev.map(i => ({ ...i, userAnswer: "", feedback: undefined }))
    );
    setChecked(false);
  };

  return (
    <section>
      <h3>Alphabet Naming Quiz</h3>
      {items.map((item, idx) => (
        <div key={idx}>
          <p>
            {idx + 1}. {item.letter}{" "}
            {item.feedback !== undefined && (item.feedback ? "✅" : "❌")}
          </p>
          {item.options.map(opt => (
            <label key={opt} style={{ display: "block" }}>
              <input
                type="radio"
                name={`alphabet-naming-${idx}`}
                value={opt}
                checked={item.userAnswer === opt}
                onChange={() => handleAnswer(idx, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <div style={{ marginTop: "0.5rem" }}>
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

export default AlphabetNamingQuiz;
