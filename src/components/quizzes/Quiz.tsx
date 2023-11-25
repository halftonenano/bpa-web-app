'use client';

import Question from './Question';
import { QuizType } from './QuizType';

export default function Quiz({ quiz }: { quiz: QuizType }) {
  return (
    <>
      <div>
        <h1>{quiz.title}</h1>
      </div>
      <div className="flex flex-col gap-3 p-5">
        {quiz.questions.map((question, index) => (
          <Question
            quizid={quiz.id}
            questionindex={index}
            question={question}
          />
        ))}
      </div>
    </>
  );
}
