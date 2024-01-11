export type QuizType = {
  id: string;
  title: string;
  description: string;
  questions: {
    question: string;
    choices: { value: string }[];
    answer?: number;
  }[];
};
