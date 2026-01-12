import React from "react";

type Unit = {
  title: string
  subunits: { title: string }[]
}

type Props = {
  units: Unit[]
  expandedUnit: number | null
  toggleUnit: (index: number) => void
  selectLesson: (unitIndex: number, subIndex: number) => void
  selected: { unit: number; subunit: number }
}

export default function Sidebar({
  units,
  expandedUnit,
  toggleUnit,
  selectLesson,
  selected,
}: Props) {
  return (
    <div style={{ width: "250px", borderRight: "1px solid #ccc", padding: "1rem" }}>
      {units.map((unit, uIndex) => (
        <div key={uIndex}>
          <div
            style={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={() => toggleUnit(uIndex)}
          >
            {unit.title} {expandedUnit === uIndex ? "▼" : "▶"}
          </div>

          {expandedUnit === uIndex && (
            <div style={{ paddingLeft: "1rem" }}>
              {unit.subunits.map((sub, sIndex) => (
                <div
                  key={sIndex}
                  style={{
                    cursor: "pointer",
                    fontWeight:
                      selected.unit === uIndex && selected.subunit === sIndex
                        ? "bold"
                        : "normal",
                  }}
                  onClick={() => selectLesson(uIndex, sIndex)}
                >
                  {sub.title}
                  {selected.unit === uIndex && selected.subunit === sIndex
                    ? " (selected)"
                    : ""}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
