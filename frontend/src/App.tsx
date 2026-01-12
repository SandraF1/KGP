import React, { useEffect, useState } from "react";
import { fetchUnits, fetchLessonContent, checkAnswer, LessonData, UnitData } from "./api";
import LessonViewer from "./components/LessonViewer";

export default function App() {
  const [units, setUnits] = useState<UnitData[]>([]);
  const [selected, setSelected] = useState({ unit: 0, subunit: 0 });
  const [lesson, setLesson] = useState<LessonData | null>(null);

  // Load units on mount
  useEffect(() => {
    fetchUnits().then(setUnits);
  }, []);

  // Load lesson whenever selection changes
  useEffect(() => {
    if (units.length === 0) return;
    const lessonId = units[selected.unit].subunits[selected.subunit].id;
    fetchLessonContent(lessonId).then(setLesson);
  }, [units, selected]);

  const selectLesson = (unitIndex: number, subIndex: number) => {
    setSelected({ unit: unitIndex, subunit: subIndex });
  };

  const goNext = () => {
    const { unit, subunit } = selected;
    const currentUnit = units[unit];
    if (subunit < currentUnit.subunits.length - 1) setSelected({ unit, subunit: subunit + 1 });
    else if (unit < units.length - 1) setSelected({ unit: unit + 1, subunit: 0 });
  };

  const goPrev = () => {
    const { unit, subunit } = selected;
    if (subunit > 0) setSelected({ unit, subunit: subunit - 1 });
    else if (unit > 0) {
      const prevUnit = units[unit - 1];
      setSelected({ unit: unit - 1, subunit: prevUnit.subunits.length - 1 });
    }
  };

  const isFirstLesson = selected.unit === 0 && selected.subunit === 0;
  const isLastLesson =
    selected.unit === units.length - 1 &&
    selected.subunit === units[units.length - 1].subunits.length - 1;

  if (!lesson) return <div>Loading lesson...</div>;

  return (
    <div>
      {/* Sidebar */}
      <div>
        {units.map((unit, uIndex) => (
          <div key={unit.title}>
            <div onClick={() => selectLesson(uIndex, 0)}>{unit.title}</div>
            {selected.unit === uIndex &&
              unit.subunits.map((sub, sIndex) => (
                <div key={sub.id}>
                  {sub.title} {selected.subunit === sIndex ? "(selected)" : ""}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Lesson Viewer */}
      <div>
        <LessonViewer lesson={lesson} checkAnswer={checkAnswer} />
        <div>
          <button onClick={goPrev} disabled={isFirstLesson}>
            Previous
          </button>
          <button onClick={goNext} disabled={isLastLesson}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
