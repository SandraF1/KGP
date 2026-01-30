import React, { useState, useEffect } from "react";
import { checkAnswer } from "../api"; // adjust path if needed

interface AlphabetOrderingQuizBlock {
  type: "alphabetQuiz";
  letters: string[];
  numItems: number;
  instructions?: string;
}

interface Props {
  lessonId: string;
  block: AlphabetOrderingQuizBlock;
}

interface QuizItem {
  letter: string;
  position: number;
  userAnswer: string;
  feedback?: boolean;
}

const AlphabetOrderingQuiz: React.FC<Props> = ({ lessonId, block }) => {
  const [items, setItems] = useState<QuizItem[]>([]);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Select random letters for the quiz
  useEffect(() => {
    const selected: QuizItem[] = [];
    const usedIndexes: number[] = [];

    while (selected.length < Math.min(block.numItems, block.letters.length)) {
      const r = Math.floor(Math.random() * block.letters.length);
      if (!usedIndexes.includes(r)) {
        usedIndexes.push(r);
        selected.push({ letter: block.letters[r], position: r + 1, userAnswer: "" });
      }
    }

    setItems(selected);
    setChecked(false);
  }, [block]);

  const handleChange = (idx: number, value: string) => {
    setItems(prev => {
      const updated = [...prev];
      updated[idx].userAnswer = value;
      return updated;
    });
  };

  // ✅ Check answers via backend
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
          questionId: item.letter, // send the actual letter, not index
          answer: item.userAnswer,
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
      prev.map(i => ({
        ...i,
        userAnswer: i.position.toString(),
        feedback: true,
      }))
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
      <h3>Alphabet Ordering Quiz</h3>
      {block.instructions && <p>{block.instructions}</p>}

      {items.map((item, idx) => (
        <div key={idx} style={{ marginBottom: "0.5rem" }}>
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

export default AlphabetOrderingQuiz;
