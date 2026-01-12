// This simulates calling your backend for answer validation
export async function checkAnswer(
  lessonId: string,
  question: string,
  answer: string
): Promise<{ correct: boolean }> {
  // TODO: replace with real API call
  const correctAnswers: Record<string, Record<string, string>> = {
    U1L1: { "What is the first letter of the Greek alphabet?": "Alpha" },
    U1L2: {
      "How do you say 'Hello' in Greek?": "Γειά",
      "Which word means 'Goodbye'?": "Αντίο",
    },
    U2L1: {
      "What is the Greek word for 'man'?": "ἀνήρ",
      "Which article means 'the' for masculine singular nouns?": "ὁ",
    },
  };

  const correct = correctAnswers[lessonId]?.[question] === answer;
  return new Promise((resolve) => setTimeout(() => resolve({ correct }), 300)); // simulate network delay
}
