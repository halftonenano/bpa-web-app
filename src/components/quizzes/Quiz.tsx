'use client';

import { useState } from 'react';
import Question from './Question';
import { GradeResponse, QuizType } from './QuizType';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import MarkdoneButton from '../pages/MarkdoneButton';

export default function Quiz({
  quiz,
  pageid,
}: {
  quiz: QuizType;
  pageid?: string;
}) {
  const [selections, setSelections] = useState<string[]>(
    new Array(quiz.questions.length).map((i) => ''),
  );
  const [loading, setLoading] = useState(false);

  const [corrections, setCorrections] = useState<boolean[] | null>(null);
  const [answers, setAnswers] = useState<string[] | null>(null);
  const [score, setScore] = useState(-1);

  return (
    <>
      <div
        className={cn(
          'flex flex-col gap-14',
          loading && 'pointer-events-none blur-sm',
        )}
      >
        {quiz.questions.map((question, index) => (
          <Question
            key={index}
            question={question}
            selection={selections[index]}
            setSelection={(id: string) => {
              const temp = [...selections];
              temp[index] = id;
              setSelections(temp);
            }}
            correct={corrections ? corrections[index] : undefined}
            answer={answers ? answers[index] : undefined}
          />
        ))}
      </div>

      {!corrections ? (
        <Button
          className="mt-10 flex w-full gap-2"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            try {
              const data = (await (
                await fetch(`/api/quiz/grade/${quiz.id}`, {
                  method: 'POST',
                  cache: 'no-cache',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(selections),
                })
              ).json()) as GradeResponse;

              setScore(data.score);
              setCorrections(data.correct);
              if (data.answers) setAnswers(data.answers);
            } catch {
              toast.error('Somthing went wrong');
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? (
            <>
              Submitting...
              <Loader2 size={20} className="animate-spin" />
            </>
          ) : (
            'Submit'
          )}
        </Button>
      ) : (
        <div
          className="streak mt-10 grid w-full gap-3 rounded-[0.9rem] p-3"
          style={{ gridTemplateColumns: '1fr 1fr' }}
        >
          <div
            className={cn(
              'grid h-36 w-full place-items-center rounded-[0.6rem] bg-black/10',
              answers && 'col-start-1 col-end-3',
            )}
          >
            <div className="text-right">
              Score
              <div className="text-3xl font-bold">
                {score} / {quiz.questions.length}
              </div>
            </div>
          </div>
          {!answers && (
            <div className="grid w-full place-items-center rounded-[0.6rem] bg-black/10 p-8 font-bold">
              Correct Answers Are Hidden
            </div>
          )}
        </div>
      )}

      {pageid && (
        <>
          <hr className="my-8" />
          <MarkdoneButton
            pageid={pageid}
            quizComplete={score !== -1}
            automark={score !== -1}
          />
        </>
      )}
    </>
  );
}
