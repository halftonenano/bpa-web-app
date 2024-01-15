import { cn } from '@/lib/utils';
import { QuizType } from './QuizType';

export default function Question({
  question,
  selection,
  setSelection,
  correct,
  answer,
}: {
  question: QuizType['questions'][0];
  selection: string;
  setSelection: (id: string) => void;
  correct?: boolean;
  answer?: string;
}) {
  return (
    <div className="">
      <h3 className="text-lg font-bold">{question.question}</h3>
      <div className="streak-bold mb-2 mt-1 h-1"></div>
      <ul className="ml-5">
        {question.choices.map((choice) => (
          <li>
            <button
              className={cn(
                'flex w-full items-center gap-3 border-b px-5 py-3 text-left transition-colors',
                selection === choice.id
                  ? correct === undefined
                    ? 'bg-neutral-100 font-bold'
                    : correct === true
                    ? 'bg-green-200'
                    : 'bg-red-200'
                  : 'hover:bg-neutral-100',
                answer === choice.id && 'bg-green-200',
              )}
              onClick={() => {
                setSelection(choice.id);
              }}
              disabled={correct !== undefined}
            >
              {choice.value}
              {correct !== undefined && selection === choice.id && (
                <div className="whitespace-nowrap rounded-full bg-white/50 px-2 py-0.5 text-xs shadow">
                  Your Answer
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
