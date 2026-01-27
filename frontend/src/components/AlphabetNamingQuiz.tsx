import React, { useState, useEffect } from "react";

export interface AlphabetNamingBlock {
  type: "alphabetNaming";
  headers?: string[];
  rows: string[][];
}

interface Props {
  block: AlphabetNamingBlock;
}

interface ItemState {
  letter: string;
  options: string[];
  userAnswer: string;
  correctAnswer: string;
}

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const AlphabetNamingQuiz: React.FC<Props> = ({ block }) => {
  const [items, setItems] = useState<ItemState[]>([]);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    const selectedRows = block.rows.slice(0, 7);
    const allNames = block.rows.map(r => r[1]);

    const quizItems = selectedRows.map(row => {
      const correctAnswer = row[1];
      const wrongOptions = shuffle(allNames.filter(n => n !== correctAnswer)).slice(0, 3);
      return {
        letter: row[0],
        options: shuffle([correctAnswer, ...wrongOptions]),
        userAnswer: "",
        correctAnswer,
      };
    });

    setItems(quizItems);
  }, [block]);

  const handleAnswer = (idx: number, value: string) => {
    setItems(prev => {
      const updated = [...prev];
      updated[idx].userAnswer = value;
      return updated;
    });
  };

  const handleCheck = () => {
    const correct = items.filter(i => i.userAnswer === i.correctAnswer).length;
    setResult(`You got ${correct} out of ${items.length} correct.`);
    setChecked(true);
  };

  const handleShow = () => {
    setItems(prev => prev.map(i => ({ ...i, userAnswer: i.correctAnswer })));
    setResult("Correct answers are filled in.");
    setChecked(true);
  };

  const handleClear = () => {
    setItems(prev => prev.map(i => ({ ...i, userAnswer: "" })));
    setResult("");
    setChecked(false);
  };

  return (
    <section>
      <h3>Alphabet Naming Quiz</h3>
      {items.map((item, idx) => (
        <div key={idx}>
          <p>{item.letter}</p>
          {item.options.map(opt => (
            <label key={opt}>
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
      <div>
        <button onClick={handleCheck}>Check Answers</button>
        <button onClick={handleShow}>Show Answers</button>
        <button onClick={handleClear}>Clear</button>
      </div>
      {result && <div><strong>{result}</strong></div>}
    </section>
  );
};

export default AlphabetNamingQuiz;
