import React, { useEffect, useState, Suspense } from "react";
import { fetchUnits } from "./api";

// Lazy-load interactive lesson components
const lessonsMap: { [key: string]: React.LazyExoticComponent<React.FC> } = {
  U1L1: React.lazy(() => import("./lessons/Unit1Lesson1")),
  /*   U1L2: React.lazy(() => import("./lessons/Unit1Lesson2")),
  U2L1: React.lazy(() => import("./lessons/Unit2Lesson1")),
  U2L2: React.lazy(() => import("./lessons/Unit2Lesson2")), */
};

interface Subunit {
  id: string;
  title: string;
}

interface Unit {
  id: string;
  title: string;
  subunits: Subunit[];
}

const App: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [expandedUnit, setExpandedUnit] = useState<number | null>(0);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  useEffect(() => {
    fetchUnits().then((data) => {
      setUnits(data);
      setSelectedLessonId(data[0].subunits[0].id);
    });
  }, []);

  const LessonComponent = selectedLessonId
    ? lessonsMap[selectedLessonId]
    : null;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {units.map((unit, uIndex) => (
          <div key={unit.id}>
            <div
              onClick={() =>
                setExpandedUnit(expandedUnit === uIndex ? null : uIndex)
              }
              style={{
                cursor: "pointer",
                fontWeight: expandedUnit === uIndex ? "bold" : "normal",
              }}
            >
              {unit.title} {expandedUnit === uIndex ? "▼" : "▶"}
            </div>

            {expandedUnit === uIndex &&
              unit.subunits.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    paddingLeft: "20px",
                    cursor: "pointer",
                    fontWeight: selectedLessonId === sub.id ? "bold" : "normal",
                  }}
                  onClick={() => setSelectedLessonId(sub.id)}
                >
                  {sub.title}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Lesson content */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {LessonComponent ? (
          <Suspense fallback={<div>Loading lesson...</div>}>
            <LessonComponent />
          </Suspense>
        ) : (
          <p>Select a lesson</p>
        )}
      </div>
    </div>
  );
};

export default App;
