'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { pb } from '@/lib/pocketbase/client';
import {
  CoursesResponse,
  PagesRecord,
  PagesResponse,
  TeachersResponse,
  UsersResponse,
} from '@/lib/types/pocketbase';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { BookOpenCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactTextareaAutosize from 'react-textarea-autosize';

export const runtime = 'edge';

export default function Page({
  params: { courseid },
}: {
  params: { courseid: string };
}) {
  const router = useRouter();

  const [course, setCourse] = useState<CoursesResponse | null>(null);
  const [pages, setPages] = useState<PagesResponse[] | null>(null);
  const [teachers, setTeachers] = useState<
    TeachersResponse<{ user: UsersResponse }>[]
  >([]);
  const [creatingPage, setCreatingPage] = useState(false);

  useEffect(() => {
    pb.collection('courses')
      .getOne(courseid)
      .then((record) => setCourse(record));
    pb.collection('pages')
      .getFullList({ filter: `course="${courseid}"` })
      .then((records) => setPages(records));
    pb.collection('teachers')
      .getFullList<TeachersResponse<{ user: UsersResponse }>>({
        filter: `course="${courseid}"`,
        expand: 'user',
      })
      .then((records) => {
        console.log(records);
        setTeachers(records);
      });
  }, []);

  console.log(teachers);

  return (
    <div className="min-h-screen bg-neutral-50">
      {course && pages ? (
        <>
          <div className="border-b bg-white p-10">
            <div className="mx-auto max-w-6xl">
              <Link
                className="text-sm text-neutral-600 underline-offset-2 hover:underline"
                href="/courses"
              >
                ← return to courses
              </Link>
              <div className="flex w-full gap-8 pt-10">
                {course.cover !== '' ? (
                  <img
                    className="h-60 w-60 rounded-md shadow-lg"
                    src={pb.files.getUrl(course, course.cover, {
                      thumb: '512x512',
                    })}
                  />
                ) : (
                  <div
                    className="grid h-60 w-60 place-items-center rounded-md shadow-lg"
                    style={{ backgroundColor: course.color }}
                  >
                    <BookOpenCheck size={60} className="opacity-70" />
                  </div>
                )}
                <div className="w-full">
                  <div className="mt-5 flex items-end gap-5">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="name">Course name</Label>
                      <Input
                        id="name"
                        placeholder="Course Name"
                        type="text"
                        value={course.name}
                        onChange={(e) =>
                          setCourse(
                            (prev) =>
                              ({
                                ...prev,
                                name: e.target.value,
                              }) as CoursesResponse,
                          )
                        }
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        toast.promise(
                          pb.collection('courses').update(courseid, course),
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
                  <ReactTextareaAutosize
                    className="mt-5 w-full resize-none rounded-[0.8rem] border p-5 shadow-sm"
                    placeholder="description"
                    value={course.description}
                    onChange={(e) =>
                      setCourse(
                        (prev) =>
                          ({
                            ...prev,
                            description: e.target.value,
                          }) as CoursesResponse,
                      )
                    }
                  />
                  <p className="mt-2 text-neutral-600">{}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-10">
            <div className="mx-auto max-w-6xl rounded-lg border bg-white p-5">
              <Tabs defaultValue="content">
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="teachers">Teachers</TabsTrigger>
                </TabsList>
                <TabsContent value="content">
                  <hr className="my-3" />
                  <ul className="">
                    <Button
                      className="mb-4 w-full bg-neutral-50"
                      variant="outline"
                      disabled={creatingPage}
                      onClick={async () => {
                        setCreatingPage(true);
                        const newPage = await pb.collection('pages').create({
                          course: course.id,
                          title: 'Untitled Page',
                          content: '',
                        } satisfies PagesRecord);
                        router.push(`/edit/article/${newPage.id}`);
                      }}
                    >
                      {creatingPage && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      + Create page
                    </Button>

                    <DragDropContext onDragEnd={(e) => console.log(e)}>
                      <Droppable droppableId="default">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            // style={getListStyle(snapshot.isDraggingOver)}
                          >
                            {pages.map((page, index) => (
                              <Draggable
                                key={page.id}
                                draggableId={page.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <li
                                    className="flex items-center justify-between rounded px-5 py-2 transition hover:bg-neutral-200"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {page.title}
                                    <Button asChild variant="outline">
                                      <Link href={`/studio/page/${page.id}`}>
                                        Edit
                                      </Link>
                                    </Button>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </ul>
                </TabsContent>
                <TabsContent value="teachers">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">User ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachers.map((teaching) => (
                        <TableRow key={teaching.id}>
                          <TableCell className="font-medium">
                            {teaching.user}
                          </TableCell>
                          <TableCell className="font-medium">
                            {teaching.expand?.user.email ||
                              '[only viewable to admins]'}
                          </TableCell>
                          <TableCell>{teaching.updated}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      ) : (
        <div className="grid min-h-screen place-items-center">
          fetching data...
        </div>
      )}
    </div>
  );
}
