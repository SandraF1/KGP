import React from "react";
import { LessonData, ContentBlock } from "../types/LessonData";
import AlphabetNamingQuiz from "./AlphabetNamingQuiz";
import TFQuiz from "./TFQuiz";
import AlphabetOrderingQuiz from "./AlphabetOrderingQuiz";

interface Props {
  lesson: LessonData;
  onNext?: () => void;
  onBack?: () => void;
}

const LessonViewer: React.FC<Props> = ({ lesson, onNext, onBack }) => {
  return (
    <div>
      <h2>{lesson.title}</h2>

      {(lesson.content || []).map((block: ContentBlock, idx: number) => {
        switch (block.type) {
          case "paragraph":
            return <p key={idx}>{block.text}</p>;

          case "example":
            return <p key={idx}>{block.text}</p>;

          case "table":
            return (
              <table key={idx}>
                <thead>
                  <tr>
                    {block.headers.map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );

          case "alphabetQuiz":
            return (
              <AlphabetOrderingQuiz
                key={idx}
                lessonId={lesson.id}
                block={block}
              />
            );

          case "alphabetNaming":
            return (
              <AlphabetNamingQuiz
                key={idx}
                lessonId={lesson.id}
                block={block}
              />
            );

          case "tf":
            return (
              <TFQuiz
                key={idx}
                lessonId={lesson.id}
                block={block}
              />
            );

          default:
            return null;
        }
      })}

      {(onBack || onNext) && (
        <div style={{ marginTop: "1rem" }}>
          {onBack && <button onClick={onBack}>Back</button>}
          {onNext && (
            <button onClick={onNext} style={{ marginLeft: "0.5rem" }}>
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonViewer;
