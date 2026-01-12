// src/App.tsx
import React, { useState } from "react";
import { unitsData } from "./lessonLoader";

export default function App() {
  const [selected, setSelected] = useState({ unit: 0, subunit: 0 });
  const [expandedUnit, setExpandedUnit] = useState(0);

  const currentLessonComponent =
    unitsData[selected.unit].subunits[selected.subunit].component;

  const goNext = () => {
    const { unit, subunit } = selected;
    const currentUnit = unitsData[unit];

    if (subunit < currentUnit.subunits.length - 1) {
      setSelected({ unit, subunit: subunit + 1 });
    } else if (unit < unitsData.length - 1) {
      setSelected({ unit: unit + 1, subunit: 0 });
      setExpandedUnit(unit + 1);
    }
  };

  const goPrev = () => {
    const { unit, subunit } = selected;
    if (subunit > 0) {
      setSelected({ unit, subunit: subunit - 1 });
    } else if (unit > 0) {
      const prevUnit = unitsData[unit - 1];
      setSelected({ unit: unit - 1, subunit: prevUnit.subunits.length - 1 });
      setExpandedUnit(unit - 1);
    }
  };

  const toggleUnit = (index: number) =>
    setExpandedUnit(index === expandedUnit ? -1 : index);

  const selectLesson = (unitIndex: number, subIndex: number) => {
    setSelected({ unit: unitIndex, subunit: subIndex });
    setExpandedUnit(unitIndex);
  };

  const isFirstLesson = selected.unit === 0 && selected.subunit === 0;
  const isLastLesson =
    selected.unit === unitsData.length - 1 &&
    selected.subunit ===
      unitsData[unitsData.length - 1].subunits.length - 1;

  const LessonComponent = currentLessonComponent;

  return (
    <div>
      <div>
        {unitsData.map((unit, uIndex) => (
          <div key={unit.title}>
            <div onClick={() => toggleUnit(uIndex)}>{unit.title}</div>
            {expandedUnit === uIndex &&
              unit.subunits.map((_, lIndex) => (
                <div key={lIndex} onClick={() => selectLesson(uIndex, lIndex)}>
                  Lesson {lIndex + 1}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div>
        <LessonComponent />
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
