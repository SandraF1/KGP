import React, { useState, useEffect } from "react";
import { LessonData, AlphabetQuizBlock, TableBlock } from "../types/LessonData";

interface Props {
  lesson: LessonData;
  onNext?: () => void;
  onBack?: () => void;
}

interface AlphabetQuizItem {
  letter: string;
  position: number;
  userAnswer: string;
}

interface ConceptCheckItemState {
  letter: string;
  options: string[];
  userAnswer: string;
  correctAnswer: string;
}

const LessonViewer: React.FC<Props> = ({ lesson, onNext, onBack }) => {
  const [alphabetQuizItems, setAlphabetQuizItems] = useState<Record<number, AlphabetQuizItem[]>>({});
  const [alphabetResults, setAlphabetResults] = useState<Record<number, string>>({});
  const [alphabetChecked, setAlphabetChecked] = useState<Record<number, boolean>>({});

  const [conceptCheckItems, setConceptCheckItems] = useState<Record<number, ConceptCheckItemState[]>>({});
  const [conceptCheckResults, setConceptCheckResults] = useState<Record<number, string>>({});
  const [conceptCheckChecked, setConceptCheckChecked] = useState<Record<number, boolean>>({});

  const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

  // Initialize quizzes per block
  useEffect(() => {
    (lesson.content || []).forEach((block, idx) => {
      // Alphabet Ordering Quiz
      if (block.type === "alphabetQuiz" && !alphabetQuizItems[idx]) {
        const letters = block.letters;
        const numItems = Math.min(block.numItems, letters.length);
        const selected: AlphabetQuizItem[] = [];
        const usedIndexes: number[] = [];

        while (selected.length < numItems) {
          const r = Math.floor(Math.random() * letters.length);
          if (!usedIndexes.includes(r)) {
            usedIndexes.push(r);
            selected.push({ letter: letters[r], position: r + 1, userAnswer: "" });
          }
        }

        setAlphabetQuizItems(prev => ({ ...prev, [idx]: selected }));
        setAlphabetChecked(prev => ({ ...prev, [idx]: false }));
        setAlphabetResults(prev => ({ ...prev, [idx]: "" }));
      }

      // Concept Check (Alphabet Naming) - **limit to 7 random letters**
      if (block.type === "hiddenTable" && !conceptCheckItems[idx]) {
        const allRows = shuffle(block.rows); // shuffle all rows
        const selectedRows = allRows.slice(0, 7); // take only 7 letters
        const allNames = block.rows.map(r => r[1]);

        const items = selectedRows.map(row => {
          const letter = row[0];
          const correctAnswer = row[1];
          const wrongOptions = shuffle(allNames.filter(n => n !== correctAnswer)).slice(0, 3);
          const options = shuffle([correctAnswer, ...wrongOptions]);
          return { letter, options, userAnswer: "", correctAnswer };
        });

        setConceptCheckItems(prev => ({ ...prev, [idx]: items }));
        setConceptCheckChecked(prev => ({ ...prev, [idx]: false }));
        setConceptCheckResults(prev => ({ ...prev, [idx]: "" }));
      }
    });
  }, [lesson.content]);

  // ------------------------------
  // Alphabet Quiz Handlers
  // ------------------------------
  const handleAlphabetChange = (blockIdx: number, itemIdx: number, value: string) => {
    setAlphabetQuizItems(prev => {
      const updated = [...(prev[blockIdx] || [])];
      updated[itemIdx].userAnswer = value;
      return { ...prev, [blockIdx]: updated };
    });
  };

  const checkAlphabetAnswers = (blockIdx: number) => {
    const items = alphabetQuizItems[blockIdx] || [];
    const correct = items.filter(i => parseInt(i.userAnswer) === i.position).length;
    setAlphabetChecked(prev => ({ ...prev, [blockIdx]: true }));
    setAlphabetResults(prev => ({ ...prev, [blockIdx]: `You got ${correct} out of ${items.length} correct.` }));
  };

  const showAlphabetAnswers = (blockIdx: number) => {
    setAlphabetQuizItems(prev => ({
      ...prev,
      [blockIdx]: prev[blockIdx].map(i => ({ ...i, userAnswer: i.position.toString() }))
    }));
    setAlphabetChecked(prev => ({ ...prev, [blockIdx]: true }));
    setAlphabetResults(prev => ({ ...prev, [blockIdx]: "Correct answers are filled in." }));
  };

  const clearAlphabetAnswers = (blockIdx: number) => {
    setAlphabetQuizItems(prev => ({
      ...prev,
      [blockIdx]: prev[blockIdx].map(i => ({ ...i, userAnswer: "" }))
    }));
    setAlphabetChecked(prev => ({ ...prev, [blockIdx]: false }));
    setAlphabetResults(prev => ({ ...prev, [blockIdx]: "" }));
  };

  const getInputClass = (blockIdx: number, item: AlphabetQuizItem) => {
    if (!alphabetChecked[blockIdx]) return "form-control me-2";
    return parseInt(item.userAnswer) === item.position
      ? "form-control border-success me-2"
      : "form-control border-danger me-2";
  };

  // ------------------------------
  // Concept Check Handlers
  // ------------------------------
  const handleConceptAnswer = (blockIdx: number, itemIdx: number, answer: string) => {
    setConceptCheckItems(prev => {
      const updated = [...(prev[blockIdx] || [])];
      updated[itemIdx].userAnswer = answer;
      return { ...prev, [blockIdx]: updated };
    });
  };

  const checkConceptAnswers = (blockIdx: number) => {
    const items = conceptCheckItems[blockIdx] || [];
    const correct = items.filter(i => i.userAnswer === i.correctAnswer).length;
    setConceptCheckChecked(prev => ({ ...prev, [blockIdx]: true }));
    setConceptCheckResults(prev => ({ ...prev, [blockIdx]: `You got ${correct} out of ${items.length} correct.` }));
  };

  const showConceptAnswers = (blockIdx: number) => {
    setConceptCheckItems(prev => ({
      ...prev,
      [blockIdx]: prev[blockIdx].map(i => ({ ...i, userAnswer: i.correctAnswer }))
    }));
    setConceptCheckChecked(prev => ({ ...prev, [blockIdx]: true }));
    setConceptCheckResults(prev => ({ ...prev, [blockIdx]: "Correct answers are filled in." }));
  };

  const clearConceptAnswers = (blockIdx: number) => {
    setConceptCheckItems(prev => ({
      ...prev,
      [blockIdx]: prev[blockIdx].map(i => ({ ...i, userAnswer: "" }))
    }));
    setConceptCheckChecked(prev => ({ ...prev, [blockIdx]: false }));
    setConceptCheckResults(prev => ({ ...prev, [blockIdx]: "" }));
  };

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div className="lesson-viewer">
      <h2>{lesson.title}</h2>

      {(lesson.content || []).map((block, idx) => {
        switch (block.type) {
          case "paragraph":
            return <p key={idx}>{block.text}</p>;

          case "example":
            return <p key={idx} className="lesson-example">{block.text}</p>;

          case "table":
            return (
              <table key={idx} className="lesson-table">
                <thead><tr>{block.headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx}>{row.map((cell, cIdx) => <td key={cIdx}>{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            );

          case "hiddenTable":
            const ccItems = conceptCheckItems[idx] || [];
            return (
              <section key={idx} className="unit-section my-4">
                <h3>Concept Check</h3>
                {ccItems.map((item, iIdx) => (
                  <div key={iIdx} className="mb-3">
                    <p className="fw-bold fs-4">{item.letter}</p>
                    {item.options.map(opt => (
                      <div key={opt} className="form-check">
                        <input
                          type="radio"
                          name={`concept-${idx}-${iIdx}`}
                          value={opt}
                          checked={item.userAnswer === opt}
                          onChange={() => handleConceptAnswer(idx, iIdx, opt)}
                          className="form-check-input"
                        />
                        <label className="form-check-label">{opt}</label>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="mt-3">
                  <button className="btn btn-info me-2" onClick={() => checkConceptAnswers(idx)} disabled={conceptCheckChecked[idx]}>Check Answers</button>
                  <button className="btn btn-success me-2" onClick={() => showConceptAnswers(idx)}>Show Correct Answers</button>
                  <button className="btn btn-secondary" onClick={() => clearConceptAnswers(idx)}>Clear</button>
                </div>
                {conceptCheckResults[idx] && <div className="mt-3"><h4 className="fw-bold">{conceptCheckResults[idx]}</h4></div>}
              </section>
            );

          case "alphabetQuiz":
            const quizItems = alphabetQuizItems[idx] || [];
            return (
              <section key={idx} className="unit-section my-4">
                <h3>Alphabet Ordering Quiz</h3>
                {block.instructions && <p>{block.instructions}</p>}
                <div className="mb-3">
                  {quizItems.map((item, qIdx) => (
                    <div key={qIdx} className="mb-2 d-flex align-items-center">
                      <span className="fw-bold fs-2 me-3">{item.letter}</span>
                      <input
                        type="number"
                        min={1}
                        max={block.letters.length}
                        value={item.userAnswer}
                        onChange={e => handleAlphabetChange(idx, qIdx, e.target.value)}
                        className={getInputClass(idx, item)}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <button className="btn btn-info me-2" onClick={() => checkAlphabetAnswers(idx)} disabled={alphabetChecked[idx]}>Check Answers</button>
                  <button className="btn btn-success me-2" onClick={() => showAlphabetAnswers(idx)}>Show Correct Answers</button>
                  <button className="btn btn-secondary" onClick={() => clearAlphabetAnswers(idx)}>Clear</button>
                </div>
                {alphabetResults[idx] && <div className="mt-3"><h4 className="fw-bold">{alphabetResults[idx]}</h4></div>}
              </section>
            );

          default:
            return null;
        }
      })}

      {/* Lesson-level navigation */}
      {(onBack || onNext) && (
        <div className="mt-4 d-flex justify-content-between">
          {onBack && <button className="btn btn-secondary" onClick={onBack}>Back</button>}
          {onNext && <button className="btn btn-secondary" onClick={onNext}>Next</button>}
        </div>
      )}
    </div>
  );
};

export default LessonViewer;
