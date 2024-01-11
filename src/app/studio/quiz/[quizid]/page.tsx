'use client';

import '@/components/pages/markdown.css';
import { QuizType } from '@/components/quizzes/QuizType';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pb } from '@/lib/pocketbase/client';
import { PagesResponse, QuizzesResponse } from '@/lib/types/pocketbase';
import { X } from 'lucide-react';
import { marked } from 'marked';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactTextareaAutosize from 'react-textarea-autosize';

export const runtime = 'edge';

export default function Page({
  params: { quizid },
}: {
  params: { quizid: string };
}) {
  const [record, setRecord] = useState<QuizzesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    pb.collection('quizzes')
      .getOne(quizid)
      .then((value) => {
        setRecord(value);
        setIsLoading(false);
      });
  }, []);

  console.log(record);

  return (
    <div className="min-h-screen bg-neutral-50">
      {!isLoading ? (
        <>
          <div className="sticky top-0 bg-white p-3 shadow-md">
            <div className="flex items-center">
              <div className="flex w-full items-center justify-between gap-3">
                {record && (
                  <>
                    <div className="ml-3 flex items-center gap-3">
                      <h1 className="font-bold">Quiz</h1>
                      <Input
                        className="w-96"
                        value={record.title}
                        onChange={(e) => {
                          setRecord({ ...record, title: e.target.value });
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button asChild variant="outline">
                        <Link href={`/studio/course/${record.course}`}>
                          Return
                        </Link>
                      </Button>
                      <Button
                        onClick={async () => {
                          if (!record) return;
                          toast.promise(
                            pb.collection('quizzes').update(quizid, record),
                            {
                              loading: 'Saving...',
                              success: 'Saved!',
                              error: 'Failed to Save',
                            },
                          );
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-10">
            <div className="mx-auto max-w-6xl rounded-lg border bg-white p-5">
              <div className="flex flex-col">
                {record?.questions ? (
                  (record.questions as QuizType['questions']).map(
                    (question, i) => (
                      <div key={i}>
                        <div className="flex gap-3">
                          <Input
                            placeholder="Question"
                            type="text"
                            value={question.question}
                            onChange={(e) => {
                              let tempquestions =
                                record.questions as QuizType['questions'];
                              tempquestions[i].question = e.target.value;
                              setRecord({
                                ...record,
                                questions: tempquestions,
                              });
                            }}
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              let tempquestions =
                                record.questions as QuizType['questions'];
                              tempquestions.splice(i, 1);
                              setRecord({
                                ...record,
                                questions: tempquestions,
                              });
                            }}
                          >
                            <X size={18} />
                          </Button>
                        </div>
                        <div className="mt-4 flex flex-col gap-3 border-l-4 pl-5">
                          {question.choices.map((choice, k) => (
                            <div className="flex items-center gap-1" key={k}>
                              <Checkbox
                                className="mr-3"
                                checked={question.answer === k}
                                onCheckedChange={(e) => {
                                  let tempquestions =
                                    record.questions as QuizType['questions'];
                                  tempquestions[i].answer = k;
                                  setRecord({
                                    ...record,
                                    questions: tempquestions,
                                  });
                                }}
                              />
                              <Input
                                placeholder="Choice"
                                type="text"
                                value={choice.value}
                                onChange={(e) => {
                                  let tempquestions =
                                    record.questions as QuizType['questions'];
                                  tempquestions[i].choices[k].value =
                                    e.target.value;
                                  setRecord({
                                    ...record,
                                    questions: tempquestions,
                                  });
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  let tempquestions =
                                    record.questions as QuizType['questions'];
                                  tempquestions[i].choices.splice(k, 1);
                                  setRecord({
                                    ...record,
                                    questions: tempquestions,
                                  });
                                }}
                              >
                                <X size={18} />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="secondary"
                            onClick={(e) => {
                              let tempquestions =
                                record.questions as QuizType['questions'];
                              tempquestions[i].choices = [
                                ...tempquestions[i].choices,
                                { value: '' },
                              ];
                              setRecord({
                                ...record,
                                questions: tempquestions,
                              });
                            }}
                          >
                            + Choice
                          </Button>
                        </div>
                        <hr className="my-5" />
                      </div>
                    ),
                  )
                ) : (
                  <></>
                )}
                <Button
                  onClick={() =>
                    setRecord({
                      ...record,
                      questions: [
                        ...((record?.questions as QuizType['questions']) || []),
                        {
                          question: '',
                          choices: [],
                        } satisfies QuizType['questions'][0],
                      ],
                    } as QuizzesResponse)
                  }
                >
                  + New Question
                </Button>
              </div>
            </div>
          </div>

          {/* <ReactTextareaAutosize
            className="h-full w-full resize-none overflow-visible bg-transparent p-10 leading-relaxed focus:outline-none"
            placeholder="Markdown content goes here!"
            // value={content}
            // onChange={(e) => setContent(e.target.value)}
          /> */}
        </>
      ) : (
        <div className="grid h-screen place-items-center">
          Loading the editor and content...
        </div>
      )}
    </div>
  );
}
//