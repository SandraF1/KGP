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

    fetchLessonContent(lessonId).then((data) => {
      setLesson({
        id: data.id,
        title: data.title,
        content: data.content,
      });
    });
  }, [units, selected]);

  useEffect(() => {
  setExpandedUnit(selected.unit);
}, [selected.unit]);

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
    <div
      className="container-fluid"
      style={{ minHeight: "100vh", display: "flex" }}
    >
      {/* Sidebar */}
      <Sidebar
        units={units}
        expandedUnit={expandedUnit}
        toggleUnit={toggleUnit}
        selectLesson={selectLesson}
        selected={selected}
      />

      {/* Lesson Viewer + Navigation */}

      <main className="container" style={{ flex: 1, padding: "1rem" }}>
        <LessonViewer lesson={lesson} />
        <div style={{ marginTop: "1rem" }}>
          <button
            className="primary"
            onClick={goPrev}
            disabled={isFirstLesson}
            style={{ marginRight: "0.5rem" }}
          >
            Previous
          </button>
          <button className="primary" onClick={goNext} disabled={isLastLesson}>
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
