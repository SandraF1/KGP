import React, { useState, useEffect } from "react";
import { checkAnswer, fetchCorrectAnswers } from "../api";

interface AlphabetOrderingQuizBlock {
  type: "alphabetQuiz";
  letters: string[];          // letters from backend
  numItems: number;
  instructions?: string;
}

interface Props {
  lessonId: string;
  block: AlphabetOrderingQuizBlock;
}

interface QuizItem {
  letter: string;
  position: number;     // correct position from backend
  userAnswer: string;
  feedback?: boolean;
}

const AlphabetOrderingQuiz: React.FC<Props> = ({ lessonId, block }) => {
  const [items, setItems] = useState<QuizItem[]>([]);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!block.letters || block.letters.length === 0) return;

    // select random letters for quiz
    const available = block.letters.filter(l => l); // remove undefined
    const selected: QuizItem[] = [];
    const usedIndexes: number[] = [];

    while (selected.length < Math.min(block.numItems, available.length)) {
      const r = Math.floor(Math.random() * available.length);
      if (!usedIndexes.includes(r)) {
        usedIndexes.push(r);
        selected.push({
          letter: available[r],
          position: r + 1,  // temporary, will be replaced by backend check
          userAnswer: "",
        });
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
      }
    }

    setItems(newItems);
    setChecked(true);
    setLoading(false);
  };

  const handleShow = async () => {
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
