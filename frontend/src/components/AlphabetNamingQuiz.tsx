import React, { useState, useEffect } from "react";
import { AlphabetNamingBlock, AlphabetNamingRow } from "../types/LessonData";
import { checkAnswer, fetchCorrectAnswers } from "../api";

interface Props {
  lessonId: string;
  block: AlphabetNamingBlock;
}

interface AnswerState {
  [symbol: string]: string;
}

interface FeedbackState {
  [symbol: string]: boolean;
}

interface OptionsState {
  [symbol: string]: string[];
}

export default function AlphabetNamingQuiz({ lessonId, block }: Props) {
  const [answers, setAnswers] = useState<AnswerState>({});
  const [feedback, setFeedback] = useState<FeedbackState>({});
  const [mode, setMode] = useState<"none" | "check" | "show">("none");
  const [loading, setLoading] = useState(false);
  const [optionsMap, setOptionsMap] = useState<OptionsState>({});
  const [selectedRows, setSelectedRows] = useState<AlphabetNamingRow[]>([]);

  // Initialize quiz
  useEffect(() => {
    const allAnswers = block.rows.map(r => r.answer);

    // Pick 7 random rows
    const shuffled = [...block.rows].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, 7);
    setSelectedRows(chosen);

    const initAnswers: AnswerState = {};
    const initFeedback: FeedbackState = {};
    const initOptions: OptionsState = {};

    chosen.forEach(row => {
      initAnswers[row.symbol] = "";
      initFeedback[row.symbol] = false;

      const wrong = allAnswers
        .filter(a => a !== row.answer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const opts = [row.answer, ...wrong].sort(() => Math.random() - 0.5);
      initOptions[row.symbol] = opts;
    });

    setAnswers(initAnswers);
    setFeedback(initFeedback);
    setOptionsMap(initOptions);
    setMode("none");
  }, [block]);

  const handleChange = (symbol: string, value: string) => {
    setAnswers(prev => ({ ...prev, [symbol]: value }));
  };

  const handleCheck = async () => {
    setLoading(true);
    const newFeedback: FeedbackState = {};

    for (const row of selectedRows) {
      const userAnswer = answers[row.symbol];
      if (!userAnswer) continue;

      try {
        const res = await checkAnswer({
          lessonId,
          blockType: "alphabetNaming",
          questionId: row.symbol, // correct
          answer: userAnswer,
        });

        newFeedback[row.symbol] = res.correct;
      } catch (err) {
        console.error("Check answer failed:", err);
        newFeedback[row.symbol] = false;
      }
    }

    setFeedback(newFeedback);
    setMode("check");
    setLoading(false);
  };

  const handleShow = async () => {
    setLoading(true);
    try {
      const res = await fetchCorrectAnswers(lessonId);
      const correctMap = res.answers.alphabetNaming || {};

      const newAnswers: AnswerState = {};
      const newFeedback: FeedbackState = {};

      selectedRows.forEach(row => {
        newAnswers[row.symbol] = correctMap[row.symbol] || "";
        newFeedback[row.symbol] = true;
      });

      setAnswers(newAnswers);
      setFeedback(newFeedback);
      setMode("show");
    } catch (err) {
      console.error("Failed to fetch correct answers:", err);
    }
    setLoading(false);
  };

  const handleClear = () => {
    const cleared: AnswerState = {};
    const clearedFeedback: FeedbackState = {};

    selectedRows.forEach(row => {
      cleared[row.symbol] = "";
      clearedFeedback[row.symbol] = false;
    });

    setAnswers(cleared);
    setFeedback(clearedFeedback);
    setMode("none");
  };

  return (
    <section>
      {block.instruction && <h3>{block.instruction}</h3>}

      {selectedRows.map(row => {
        const symbol = row.symbol;
        const fb = feedback[symbol];

        return (
          <div key={symbol} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>{symbol}</div>

            {optionsMap[symbol]?.map(option => (
              <label key={option} style={{ display: "block", cursor: "pointer" }}>
                <input
                  type="radio"
                  name={symbol}
                  value={option}
                  checked={answers[symbol] === option}
                  onChange={() => handleChange(symbol, option)}
                  disabled={mode === "show"}
                />
                <span style={{ marginLeft: 6 }}>{option}</span>
              </label>
            ))}

            {(mode === "check" || mode === "show") && fb !== undefined && (
              <span style={{ marginLeft: 8 }}>{fb ? "✅" : "❌"}</span>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 12 }}>
        <button onClick={handleCheck} disabled={loading}>
          {loading ? "Checking..." : "Check Answers"}
        </button>

        <button onClick={handleShow} disabled={loading} style={{ marginLeft: 8 }}>
          Show Answers
        </button>

        <button onClick={handleClear} style={{ marginLeft: 8 }}>
          Clear
        </button>
      </div>
    </section>
  );
}
