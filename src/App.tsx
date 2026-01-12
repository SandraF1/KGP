import React, { useState } from "react";

// Error boundary to catch DOM/React errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong in this component.</div>;
    }
    return this.props.children;
  }
}

// Unit data
interface Unit {
  title: string;
  subunits: string[];
}

const unitsData: Unit[] = [
  { title: "Unit 1", subunits: ["Lesson 1", "Lesson 2", "Lesson 3"] },
  { title: "Unit 2", subunits: ["Lesson 1", "Lesson 2"] },
  { title: "Unit 3", subunits: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4"] },
  { title: "Unit 4", subunits: ["Lesson 1"] },
];

// Selected state
interface Selected {
  unit: number;
  subunit: number;
}

// Main App
const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedUnit, setExpandedUnit] = useState(0); // first unit expanded
  const [selected, setSelected] = useState<Selected>({ unit: 0, subunit: 0 });

  const toggleUnit = (index: number) => {
    setExpandedUnit(index);
  };

  const selectSubunit = (unitIndex: number, subIndex: number) => {
    setSelected({ unit: unitIndex, subunit: subIndex });
    setExpandedUnit(unitIndex);
  };

  const goNext = () => {
    const { unit, subunit } = selected;

    if (subunit < unitsData[unit].subunits.length - 1) {
      setSelected({ unit, subunit: subunit + 1 });
    } else if (unit < unitsData.length - 1) {
      setSelected({ unit: unit + 1, subunit: 0 });
      setExpandedUnit(unit + 1);
    } else {
      alert("You have reached the last lesson!");
    }
  };

  const currentUnit = unitsData[selected.unit];
  const currentLesson = currentUnit.subunits[selected.subunit];

  return (
    <div>
      {/* Top banner */}
      <div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <span>The Koine Greek Project</span>
      </div>

      {/* Layout */}
      <div>
        {/* Sidebar */}
        {sidebarOpen && (
          <div>
            {unitsData.map((unit, uIndex) => (
              <div key={`unit-${uIndex}`}>
                <div onClick={() => toggleUnit(uIndex)}>
                  {unit.title} {expandedUnit === uIndex ? "▼" : "▶"}
                </div>
                {expandedUnit === uIndex && (
                  <div>
                    {unit.subunits.map((subunit, sIndex) => (
                      <div
                        key={`unit-${uIndex}-sub-${sIndex}`}
                        onClick={() => selectSubunit(uIndex, sIndex)}
                      >
                        {subunit}{" "}
                        {selected.unit === uIndex && selected.subunit === sIndex
                          ? "(selected)"
                          : ""}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Right content */}
        <div>
          <h2>
            {currentUnit.title} - {currentLesson}
          </h2>
          <p>Content for {currentLesson} goes here.</p>
          <button onClick={goNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

// Export with ErrorBoundary
const WrappedApp: React.FC = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default WrappedApp;
