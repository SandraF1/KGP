import React from "react";

type Lesson = {
  title: string
  content: string
}

type Props = {
  lesson: Lesson | null
  onNext: () => void
  onPrev: () => void
  disableNext: boolean
  disablePrev: boolean
}

export default function LessonViewer({
  lesson,
  onNext,
  onPrev,
  disableNext,
  disablePrev,
}: Props) {
  if (!lesson) return <div>Loading lesson…</div>

  return (
    <div style={{ padding: "1.5rem", flex: 1 }}>
      <h2>{lesson.title}</h2>
      <div style={{ margin: "1rem 0" }}>{lesson.content}</div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={onPrev} disabled={disablePrev}>
          ◀ Previous
        </button>
        <button onClick={onNext} disabled={disableNext}>
          Next ▶
        </button>
      </div>
    </div>
  )
}
