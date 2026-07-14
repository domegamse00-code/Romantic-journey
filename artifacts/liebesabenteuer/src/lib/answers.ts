// Internal memory for the adventure journey.
// Answers are collected silently as the visitor progresses and are not
// displayed anywhere — they are meant to be exported together later
// (date, activity, time, food, etc.).

export type Answers = Record<string, unknown>;

const answers: Answers = {};

export function setAnswer(key: string, value: unknown) {
  answers[key] = value;
}

export function getAnswer(key: string) {
  return answers[key];
}

export function getAnswers(): Answers {
  return { ...answers };
}
