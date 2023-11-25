'use client';

import Question from './Question';
import { QuizType } from './QuizType';

export default function Quiz({ quiz }: { quiz: QuizType }) {
  return (
    <>
      <div className="flex flex-col gap-3">
        {quiz.questions.map((question, index) => (
          <Question
            key={index}
            quizid={quiz.id}
            questionindex={index}
            question={question}
          />
        ))}
      </div>
    </>
  );
}
