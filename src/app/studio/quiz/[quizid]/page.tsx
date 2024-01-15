'use client';

import '@/components/pages/markdown.css';
import { QuizType } from '@/components/quizzes/QuizType';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { pb } from '@/lib/pocketbase/client';
import { QuizzesResponse } from '@/lib/types/pocketbase';
import { Trash2, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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
      })
      .catch((e) => {
        toast.error(e.data.message);
      });
  }, []);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-50">
      {!isLoading && record ? (
        <>
          <div className="sticky top-16 bg-white p-3 shadow-md">
            <div className="flex items-center">
              <div className="flex w-full items-center justify-between gap-3">
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

                    <AlertDialog>
                      <Button className="w-fit" variant="destructive" asChild>
                        <AlertDialogTrigger className="w-fit">
                          <Trash2 size={18} />
                        </AlertDialogTrigger>
                      </Button>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Page</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              toast.promise(
                                new Promise<void>(async (resolve, reject) => {
                                  try {
                                    await pb
                                      .collection('quizzes')
                                      .delete(quizid);
                                  } catch {
                                    reject();
                                  }
                                  await router.push(
                                    `/studio/course/${record?.course}`,
                                  );
                                  resolve();
                                }),
                                {
                                  loading: 'Deleting quiz...',
                                  success: `Quiz deleted!`,
                                  error: 'Something went wrong',
                                },
                                { duration: 10000 },
                              );
                            }}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              </div>
            </div>
          </div>

          <div className="p-10">
            <div className="mx-auto max-w-6xl rounded-lg border bg-white p-5">
              <div className="flex flex-col">
                {(record.questions as QuizType['questions']).map(
                  (question, i) => (
                    // Render Questions
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
                          onClick={() => {
                            let temp =
                              record.questions as QuizType['questions'];
                            temp.splice(i, 1);
                            setRecord({
                              ...record,
                              questions: temp,
                            });
                          }}
                        >
                          <X size={18} />
                        </Button>
                      </div>

                      <div className="my-2 h-1"></div>

                      <div className="mt-2 flex flex-col gap-3 border-l-4 pl-5">
                        {question.choices.map((choice, k) => (
                          <div className="flex items-center gap-1" key={k}>
                            <Checkbox
                              className="mr-3"
                              checked={question.answer === choice.id}
                              onCheckedChange={(e) => {
                                let tempquestions =
                                  record.questions as QuizType['questions'];
                                tempquestions[i].answer = choice.id;
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
                              { id: nanoid(), value: '' },
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
                          answer: '',
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
