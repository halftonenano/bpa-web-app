'use client';

import '@/components/pages/markdown.css';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pb } from '@/lib/pocketbase/client';
import {
  AssignmentsRecord,
  PagesResponse,
  QuizzesRecord,
} from '@/lib/types/pocketbase';
import { Trash2 } from 'lucide-react';
import { marked } from 'marked';
import Link from 'next/link';
import router from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactTextareaAutosize from 'react-textarea-autosize';
import AddYoutubeEmbed from './AddYoutubeEmbed';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import SanitizedMarkdownRenderer from '@/components/pages/SanitizedMarkdownRenderer';
import YoutubeEmbed from '@/components/YoutubeEmbed';
import UniversalPicker from '@/components/UniversalPicker';
import { QuizType } from '@/components/quizzes/QuizType';
import { nanoid } from 'nanoid';

export const runtime = 'edge';

export default function Page({
  params: { pageid },
}: {
  params: { pageid: string };
}) {
  const [record, setRecord] = useState<PagesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    pb.collection('pages')
      .getOne(pageid)
      .then((value) => {
        setRecord(value);
        setIsLoading(false);
      })
      .catch((e) => {
        toast.error(e.data.message);
      });
  }, []);

  const [creating, setCreating] = useState(false);

  return (
    <div className="h-[calc(100vh_-_4rem)] bg-neutral-50">
      {!isLoading && record ? (
        <>
          <div className="sticky top-0 -mb-px border-b bg-white">
            <div className="flex h-14 items-center px-2">
              <div className="ml-3 flex-shrink-0 font-bold">Page Editor</div>
              <div className="flex w-full items-center justify-end gap-3">
                <Button asChild variant="outline">
                  <Link href={`/studio/course/${record?.course}`}>
                    Return to Editing Course
                  </Link>
                </Button>

                <Button
                  onClick={async () => {
                    toast.promise(
                      pb.collection('pages').update(pageid, record),
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
                                await pb.collection('pages').delete(pageid);
                              } catch {
                                reject();
                              }
                              await router.push(
                                `/studio/course/${record?.course}`,
                              );
                              resolve();
                            }),
                            {
                              loading: 'Deleting page...',
                              success: `Page deleted!`,
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
            </div>
          </div>
          <div
            className="grid h-[calc(100%_-_3.5rem)]"
            style={{ gridTemplate: 'auto 1fr / 1fr 1fr' }}
          >
            <div className="h-full overflow-visible overflow-y-scroll p-10">
              <div className="pointer-events-none rounded-xl border bg-white p-14 shadow-lg">
                <h1 className="text-4xl font-bold">{record.title}</h1>
                <hr className="my-10" />

                {record.video !== '' && (
                  <>
                    <YoutubeEmbed videoId={record.video} />
                    <hr className="my-10" />
                  </>
                )}

                <SanitizedMarkdownRenderer content={record.content} />

                {record.quiz && (
                  <div className="streak-bold mt-5 rounded-[0.6rem] p-2 shadow-sm">
                    <div className="rounded-[0.5rem] bg-white p-10 text-center font-bold">
                      Quiz
                    </div>
                  </div>
                )}

                {record.assignment && (
                  <div className="streak-bold mt-5 rounded-[0.6rem] p-2 shadow-sm">
                    <div className="rounded-[0.5rem] bg-white p-10 text-center font-bold">
                      Assignment
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-full overflow-y-scroll">
              <div className="p-10 pb-0">
                <Card>
                  <CardHeader>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      className="bg-white"
                      type="text"
                      id="title"
                      placeholder="Title"
                      value={record.title}
                      onChange={(e) =>
                        setRecord({ ...record, title: e.target.value })
                      }
                    />
                  </CardHeader>
                  <CardContent>
                    <hr className="mb-5" />

                    <AddYoutubeEmbed record={record} setRecord={setRecord} />
                  </CardContent>
                </Card>
              </div>

              <ReactTextareaAutosize
                className="w-full resize-none overflow-y-visible bg-transparent p-10 font-sans leading-relaxed focus:outline-none"
                placeholder="Markdown content goes here!"
                value={record.content}
                onChange={(e) =>
                  setRecord({ ...record, content: e.target.value })
                }
              />

              <div className="p-10 pt-0">
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Label>Embed Quiz</Label>
                      <UniversalPicker
                        type="quizzes"
                        property="title"
                        initialValue={record.quiz}
                        filter={`course="${record.course}"`}
                        setSelectedId={(id) =>
                          setRecord({ ...record, quiz: id })
                        }
                      />
                      <Button
                        variant="outline"
                        disabled={creating}
                        onClick={async () => {
                          setCreating(true);
                          const quiz = await pb.collection('quizzes').create({
                            title: 'Untitled Quiz',
                            course: record.course,
                            questions: [
                              {
                                question: '',
                                choices: [
                                  { id: nanoid(), value: '' },
                                  { id: nanoid(), value: '' },
                                  { id: nanoid(), value: '' },
                                ],
                                answer: '',
                              },
                            ] satisfies QuizType['questions'],
                          } satisfies QuizzesRecord);
                          window.open(
                            `${location.origin}/studio/quiz/${quiz.id}`,
                          );
                          setCreating(false);
                        }}
                      >
                        + New Quiz
                      </Button>
                    </div>
                    <div className="mt-5 flex items-center gap-3 flex-wrap">
                      <Label>Embed Assignment</Label>
                      <UniversalPicker
                        type="assignments"
                        property="title"
                        initialValue={record.assignment}
                        filter={`course="${record.course}"`}
                        setSelectedId={(id) =>
                          setRecord({ ...record, assignment: id })
                        }
                      />
                      <Button
                        variant="outline"
                        disabled={creating}
                        onClick={async () => {
                          setCreating(true);
                          const quiz = await pb
                            .collection('assignments')
                            .create({
                              title: 'Untitled Assignment',
                              course: record.course,
                            } satisfies AssignmentsRecord);
                          window.open(
                            `${location.origin}/studio/assignment/${quiz.id}`,
                          );
                          setCreating(false);
                        }}
                      >
                        + New Assignment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid h-screen place-items-center">
          Loading the editor and content...
        </div>
      )}
    </div>
  );
}
