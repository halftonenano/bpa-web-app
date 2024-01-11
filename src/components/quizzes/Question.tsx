import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { QuizType } from './QuizType';

export default function Question({
  quizid,
  questionindex,
  question,
}: {
  quizid: string;
  questionindex: number;
  question: QuizType['questions'][0];
}) {
  const [answer, setAnswer] = useState('');
  const [correct, setCorrect] = useState('');

  return (
    <div className="rounded-md border">
      <CardHeader>
        <CardTitle>{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="overflow-hidden rounded-lg border">
          {question.choices.map((choice) => (
            <li>
              <button
                className={cn(
                  'w-full border-b px-5 py-3 transition-colors hover:bg-neutral-200',
                  answer === choice.value &&
                    (correct === 'correct'
                      ? 'bg-green-500/30'
                      : 'bg-red-500/30'),
                )}
                onClick={async () => {
                  setAnswer(choice.value);
                  setCorrect(
                    (
                      await (
                        await fetch(
                          `/api/quiz/grade/${quizid}/${questionindex}/${choice.value}`,
                          {
                            method: 'POST',
                          },
                        )
                      ).json()
                    ).grade,
                  );
                }}
              >
                {choice.value}
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </div>
  );
}
