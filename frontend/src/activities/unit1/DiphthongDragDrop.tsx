import React, { useState } from "react";

const VOWELS = ["α", "ε", "η", "ι", "ο", "υ"];

interface Props {
  instructions: string;
  lessonId: string;
}

export default function DiphthongDragDrop({ instructions, lessonId }: Props) {
  const [dragged, setDragged] = useState<string | null>(null);
  const [firstVowel, setFirstVowel] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>("");

  const onDragStart = (v: string) => setDragged(v);

  const handleDrop = async () => {
    if (!dragged) return;

    // If first vowel not yet selected, set it and wait for second
    if (!firstVowel) {
      setFirstVowel(dragged);
      setDragged(null);
      return;
    }

    const pair = firstVowel + dragged;

    try {
      const res = await fetch("http://localhost:5000/api/check-diphthong", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, attempt: pair }),
      });

      const data = await res.json();

      if (data.correct && !found.includes(pair)) {
        setFound([...found, pair]);
        setFeedback("✓ Correct");
      } else {
        setFeedback("✗ Not a diphthong");
      }
    } catch (err) {
      console.error(err);
      setFeedback("Error checking diphthong");
    }

    setTimeout(() => {
      setFirstVowel(null);
      setDragged(null);
      setFeedback("");
    }, 1000);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>{instructions}</h3>

      {/* Vowel palette */}
      <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 20 }}>
        {VOWELS.map((v) => (
          <div
            key={v}
            draggable
            onDragStart={() => onDragStart(v)}
            style={{
              width: 50,
              height: 50,
              margin: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              border: "2px solid #333",
              borderRadius: 8,
              cursor: "grab",
              backgroundColor: dragged === v ? "#f0f0f0" : "#fff",
            }}
          >
            {v}
          </div>
        ))}
      </div>

      {/* Persistent drop box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          minHeight: 80,
          width: "100%",
          border: "2px dashed #333",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          marginBottom: 10,
          backgroundColor: "#fafafa",
        }}
      >
        {firstVowel ? firstVowel + (dragged || "") : "Drop vowels here"}
      </div>

      {/* Feedback */}
      <div style={{ minHeight: 30, fontSize: 18 }}>{feedback}</div>

      {/* Found diphthongs */}
      <div style={{ marginTop: 10 }}>
        <strong>Found:</strong> {found.join(" ")}
      </div>

      {found.length === 8 && (
        <div style={{ color: "green", marginTop: 10 }}>
          🎉 All diphthongs found!
        </div>
      )}
    </div>
  );
}
