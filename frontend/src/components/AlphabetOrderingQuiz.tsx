import React, { useState, useEffect } from "react";

interface AlphabetOrderingQuizBlock {
  type: "alphabetQuiz";
  letters: string[];
  numItems: number;
  instructions?: string;
}

interface Props {
  block: AlphabetOrderingQuizBlock;
}

interface QuizItem {
  letter: string;
  position: number;
  userAnswer: string;
}

const AlphabetOrderingQuiz: React.FC<Props> = ({ block }) => {
  const [items, setItems] = useState<QuizItem[]>([]);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState("");

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
  }, [block]);

  const handleChange = (idx: number, value: string) => {
    setItems(prev => {
      const updated = [...prev];
      updated[idx].userAnswer = value;
      return updated;
    });
  };

  const handleCheck = () => {
    const correct = items.filter(i => parseInt(i.userAnswer) === i.position).length;
    setResult(`You got ${correct} out of ${items.length} correct.`);
    setChecked(true);
  };

  const handleShow = () => {
    setItems(prev => prev.map(i => ({ ...i, userAnswer: i.position.toString() })));
    setChecked(true);
    setResult("Correct answers are filled in.");
  };

  const handleClear = () => {
    setItems(prev => prev.map(i => ({ ...i, userAnswer: "" })));
    setChecked(false);
    setResult("");
  };

  return (
    <section className="unit-section my-4">
      <h3>Alphabet Ordering Quiz</h3>
      {block.instructions && <p>{block.instructions}</p>}
      <div>
        {items.map((item, idx) => (
          <div key={idx} style={{ marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>{item.letter}</span>
            <input
              type="number"
              min={1}
              max={block.letters.length}
              value={item.userAnswer}
              onChange={e => handleChange(idx, e.target.value)}
              style={{
                borderColor: checked
                  ? parseInt(item.userAnswer) === item.position ? "green" : "red"
                  : "#ccc",
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleCheck}>Check Answers</button>
        <button onClick={handleShow} style={{ marginLeft: "0.5rem" }}>Show Answers</button>
        <button onClick={handleClear} style={{ marginLeft: "0.5rem" }}>Clear</button>
      </div>
      {result && <div style={{ marginTop: "0.5rem" }}><strong>{result}</strong></div>}
    </section>
  );
};

export default AlphabetOrderingQuiz;
