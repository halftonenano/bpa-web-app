export type QuizType = {
  id: string;
  title: string;
  description: string;
  questions: {
    question: string;
    choices: { id: string; value: string }[];
    answer?: string;
  }[];
};
