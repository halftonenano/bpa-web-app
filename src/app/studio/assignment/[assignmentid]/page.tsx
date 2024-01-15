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
import { AssignmentsResponse } from '@/lib/types/pocketbase';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactTextareaAutosize from 'react-textarea-autosize';

export const runtime = 'edge';

export default function Page({
  params: { assignmentid },
}: {
  params: { assignmentid: string };
}) {
  const [record, setRecord] = useState<AssignmentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    pb.collection('assignments')
      .getOne(assignmentid)
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
    <div className="h-screen bg-neutral-50">
      {!isLoading && record ? (
        <>
          <div className="sticky top-16 -mb-px border-b bg-white">
            <div className="flex h-14 items-center px-2">
              <div className="flex w-full items-center justify-end gap-3">
                <Button asChild variant="outline">
                  <Link href={`/studio/course/${record.course}`}>
                    Return to Editing Course
                  </Link>
                </Button>

                <Button
                  onClick={async () => {
                    toast.promise(
                      pb.collection('assignments').update(assignmentid, record),
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
                      <AlertDialogTitle>Delete Assignment</AlertDialogTitle>
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
                                  .collection('assignments')
                                  .delete(assignmentid);
                              } catch {
                                reject();
                              }
                              await router.push(
                                `/studio/course/${record.course}`,
                              );
                              resolve();
                            }),
                            {
                              loading: 'Deleting assignment...',
                              success: `Assignment deleted!`,
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
          <div className="p-10">
            <div className="mx-auto max-w-6xl rounded-lg border bg-white p-10">
              <div className="streak-text">ASSIGNMENT</div>
              <div className="mb-5 mt-5 flex items-center gap-3">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  className="w-96"
                  value={record.title}
                  onChange={(e) => {
                    setRecord({ ...record, title: e.target.value });
                  }}
                />
              </div>
              <Label htmlFor="description">Description</Label>
              <ReactTextareaAutosize
                id="description"
                className="mt-2 h-full w-full resize-none overflow-visible rounded-sm border p-10 leading-relaxed shadow-sm focus:outline-none"
                placeholder="Assignment description"
                value={record.description}
                onChange={(e) =>
                  setRecord({ ...record, description: e.target.value })
                }
              />
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
//
