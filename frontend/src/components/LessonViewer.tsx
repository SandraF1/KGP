import React from "react";
import { LessonData, ContentBlock } from "../types/LessonData";
import AlphabetNamingQuiz from "./AlphabetNamingQuiz";
import TFQuiz from "./TFQuiz";
import AlphabetOrderingQuiz from "./AlphabetOrderingQuiz";
import DiphthongDragDrop from "../activities/unit1/DiphthongDragDrop";

interface Props {
  lesson: LessonData;
  onNext?: () => void;
  onBack?: () => void;
}

const LessonViewer: React.FC<Props> = ({ lesson, onNext, onBack }) => {
  return (
    <div>
      <h2>{lesson.title}</h2>

      {(lesson.content || []).map((block: ContentBlock) => {
        // Use a stable key for each block
        const key = `${block.type}-${(block as any).block_order || Math.random()}`;

        switch (block.type) {
          case "paragraph":
            return <p key={key}>{block.text}</p>;

          case "example":
            return <p key={key}>{block.text}</p>;

          case "table":
            return (
              <table key={key}>
                <thead>
                  <tr>
                    {block.headers.map((h) => (
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
                key={key}
                lessonId={lesson.id}
                block={block}
              />
            );

          case "alphabetNaming":
            return (
              <AlphabetNamingQuiz
                key={key}
                lessonId={lesson.id}
                block={block}
              />
            );

          case "tf":
            return <TFQuiz key={key} lessonId={lesson.id} block={block} />;

          case "diphthongDragDrop":
            return (
              <DiphthongDragDrop
                key={key}
                instructions={block.instructions || ""}
                lessonId={lesson.id}
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
