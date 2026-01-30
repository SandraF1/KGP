import React, { useEffect, useState } from "react";
import {
  fetchUnits,
  fetchLessonContent,
  checkAnswer,
  LessonData,
  UnitData,
} from "./api";
import LessonViewer from "./components/LessonViewer";
import Sidebar from "./components/Sidebar"; // import Sidebar

export default function App() {
  const [units, setUnits] = useState<UnitData[]>([]);
  const [selected, setSelected] = useState({ unit: 0, subunit: 0 });
  const [lesson, setLesson] = useState<LessonData | null>(null);

  // Sidebar state
  const [expandedUnit, setExpandedUnit] = useState<number | null>(0);

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

  const toggleUnit = (index: number) => {
    setExpandedUnit((prev) => (prev === index ? null : index));
  };

  const goNext = () => {
    const { unit, subunit } = selected;
    const currentUnit = units[unit];
    if (subunit < currentUnit.subunits.length - 1)
      setSelected({ unit, subunit: subunit + 1 });
    else if (unit < units.length - 1)
      setSelected({ unit: unit + 1, subunit: 0 });
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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        units={units}
        expandedUnit={expandedUnit}
        toggleUnit={toggleUnit}
        selectLesson={selectLesson}
        selected={selected}
      />

      {/* Lesson Viewer + Navigation */}
      <div style={{ padding: "1rem", flex: 1 }}>
        <LessonViewer lesson={lesson} />
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={goPrev}
            disabled={isFirstLesson}
            style={{ marginRight: "0.5rem" }}
          >
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
