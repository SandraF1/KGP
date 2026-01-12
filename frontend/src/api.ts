export const fetchUnits = async () => {
  const res = await fetch("http://localhost:5000/api/units");
  return res.json();
};

export const fetchLessonContent = async (lessonId: string) => {
  const res = await fetch(`http://localhost:5000/api/lessons/${lessonId}`);
  return res.json();
};
