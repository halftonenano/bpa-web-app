export type QuizType = {
  id: string;
  title: string;
  description: string;
  questions: {
    question: string;
    choices: { id: string; value: string }[];
    answer: string;
  }[];
};

export type GradeResponse = {
  score: number;
  possible: number;
  correct: boolean[];
  answers?: string[];
};
