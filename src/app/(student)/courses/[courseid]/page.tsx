import { Button, buttonVariants } from '@/components/ui/button';
import { serverPb } from '@/lib/pocketbase/server';
import { simplifyToSlug } from '@/lib/utils';
import { BookOpenCheck, Pencil } from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

export default async function Page({
  params: { courseid },
}: {
  params: { courseid: string };
}) {
  const pb = serverPb();

  const course = await pb.collection('courses').getOne(courseid);
  const pages = await pb
    .collection('pages')
    .getFullList({ filter: `course="${courseid}"` });

  let isTeacher = false;
  try {
    await pb
      .collection('teachers')
      .getFirstListItem(
        `course="${courseid}" && user="${pb.authStore.model?.id}"`,
      );
    isTeacher = true;
  } catch {}

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b bg-white p-10">
        <div className="mx-auto max-w-6xl">
          <Link
            className="text-sm text-neutral-600 underline-offset-2 hover:underline"
            href="/courses"
          >
            ← return to courses
          </Link>
          <div className="flex items-end gap-8 pt-10">
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
            <div>
              <div className="mt-5 flex gap-5">
                <h1 className="text-4xl font-bold">{course.name}</h1>
                {isTeacher && (
                  <Button variant="outline" asChild>
                    <Link
                      href={`/studio/course/${courseid}`}
                      className="mt-px flex gap-2"
                    >
                      <Pencil size={18} /> Edit in Studio
                    </Link>
                  </Button>
                )}
              </div>
              <p className="mt-2 text-neutral-600">{course.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-10">
        <div className="mx-auto max-w-6xl">
          <ul className="rounded-md border bg-white p-5">
            {pages.length > 0 ? (
              pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${course.id}/page/${page.id}/${simplifyToSlug(
                    page.title,
                  )}`}
                >
                  <li className="flex items-center justify-between rounded px-5 py-2 transition hover:bg-neutral-200">
                    {page.title}
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
    </div>
  );
}
