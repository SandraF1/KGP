import React, { useState } from "react";


const VOWELS = ["α", "ε", "η", "ι", "ο", "υ"];
const TRUE_DIPHTHONGS = ["αι", "ει", "οι", "υι", "αυ", "ευ", "ου", "ηυ"];

export default function DiphthongDragDrop({
  instructions
}: {
  instructions: string;
}) {
  const [currentPair, setCurrentPair] = useState<string[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>("");

  function addVowel(vowel: string) {
    if (currentPair.length === 2) return;

    const next = [...currentPair, vowel];
    setCurrentPair(next);

    if (next.length === 2) {
      checkPair(next.join(""));
    }
  }

  function checkPair(pair: string) {
    if (TRUE_DIPHTHONGS.includes(pair) && !found.includes(pair)) {
      setFound([...found, pair]);
      setFeedback("✓ Correct");
    } else {
      setFeedback("✗ Not a diphthong");
    }

    setTimeout(() => {
      setCurrentPair([]);
      setFeedback("");
    }, 800);
  }

  return (
    <div>
      <h2>{instructions}</h2>

      <div style={{ marginBottom: 20 }}>
        {VOWELS.map(v => (
          <button
            key={v}
            onClick={() => addVowel(v)}
            style={{
              margin: 6,
              padding: "10px 14px",
              fontSize: 20
            }}
          >
            {v}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 24, minHeight: 40 }}>
        {currentPair.join("") || "—"}
      </div>

      <div>{feedback}</div>

      <div style={{ marginTop: 20 }}>
        <strong>Found:</strong>{" "}
        {found.join(" ")}
      </div>

      {found.length === TRUE_DIPHTHONGS.length && (
        <div style={{ marginTop: 20, color: "green" }}>
          🎉 All diphthongs found!
        </div>
      )}
    </div>
  );
}
