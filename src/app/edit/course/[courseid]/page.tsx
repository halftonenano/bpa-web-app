'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pb } from '@/lib/pocketbase/client';
import {
  CoursesResponse,
  PagesRecord,
  PagesResponse,
} from '@/lib/types/pocketbase';
import { simplifyToSlug } from '@/lib/utils';
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
  const [creatingPage, setCreatingPage] = useState(false);

  useEffect(() => {
    pb.collection('courses')
      .getOne(courseid)
      .then((record) => setCourse(record));
    pb.collection('pages')
      .getFullList({ filter: `course="${courseid}"` })
      .then((record) => setPages(record));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {course && pages && (
        <>
          <div className="border-b bg-white p-10">
            <div className="mx-auto max-w-6xl">
              <Link
                className="text-sm text-neutral-600 underline-offset-2 hover:underline"
                href="/courses"
              >
                ← return to courses
              </Link>
              <div className="flex w-full items-end gap-8 pt-10">
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
                    className="mt-5 w-full resize-none rounded-md border p-5 shadow-sm"
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
            <div className="mx-auto max-w-6xl">
              <ul className="rounded-lg border bg-white p-5">
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

                {pages.length > 0 ? (
                  pages.map((page) => (
                    <Link
                      key={page.id}
                      href={`/${course.id}/article/${page.id}/${simplifyToSlug(
                        page.title,
                      )}`}
                    >
                      <li className="flex items-center justify-between rounded px-5 py-2 transition hover:bg-neutral-200">
                        {page.title}
                        <Button asChild variant="outline">
                          <Link href={`/edit/article/${page.id}`}>Edit</Link>
                        </Button>
                      </li>
                    </Link>
                  ))
                ) : (
                  <div className="text-center">
                    Hmmmm... There seems to be no course content here.
                  </div>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
