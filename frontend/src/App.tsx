import React, { useState } from "react";
import { unitsData, LessonData } from "./lessonLoader";
import LessonViewer from "./components/LessonViewer";

export default function App() {
  // Track selected lesson
  const [selected, setSelected] = useState({ unit: 0, subunit: 0 });

  // Expanded unit derived from selected lesson
  const expandedUnit = selected.unit;

  // Current lesson data
  const currentLesson: LessonData =
    unitsData[selected.unit].subunits[selected.subunit];

  // Navigate to next lesson
  const goNext = () => {
    const { unit, subunit } = selected;
    const currentUnit = unitsData[unit];

    if (subunit < currentUnit.subunits.length - 1) {
      setSelected({ unit, subunit: subunit + 1 });
    } else if (unit < unitsData.length - 1) {
      setSelected({ unit: unit + 1, subunit: 0 });
    }
  };

  // Navigate to previous lesson
  const goPrev = () => {
    const { unit, subunit } = selected;

    if (subunit > 0) {
      setSelected({ unit, subunit: subunit - 1 });
    } else if (unit > 0) {
      const prevUnit = unitsData[unit - 1];
      setSelected({ unit: unit - 1, subunit: prevUnit.subunits.length - 1 });
    }
  };

  // Select lesson from sidebar
  const selectLesson = (unitIndex: number, subIndex: number) => {
    setSelected({ unit: unitIndex, subunit: subIndex });
  };

  // Disable next/prev buttons at boundaries
  const isFirstLesson = selected.unit === 0 && selected.subunit === 0;
  const isLastLesson =
    selected.unit === unitsData.length - 1 &&
    selected.subunit === unitsData[unitsData.length - 1].subunits.length - 1;

  return (
    <div>
      {/* Sidebar */}
      <div>
        {unitsData.map((unit, uIndex) => (
          <div key={unit.title}>
            <div onClick={() => selectLesson(uIndex, 0)}>{unit.title}</div>

            {/* Expand the unit that contains the currently selected lesson */}
            {expandedUnit === uIndex &&
              unit.subunits.map((_, lIndex) => (
                <div key={lIndex} onClick={() => selectLesson(uIndex, lIndex)}>
                  Lesson {lIndex + 1}
                  {selected.unit === uIndex && selected.subunit === lIndex
                    ? " (selected)"
                    : ""}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Lesson Viewer */}
      <div>
        <LessonViewer lesson={currentLesson} />
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
