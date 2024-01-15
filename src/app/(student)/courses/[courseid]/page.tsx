import { Button } from '@/components/ui/button';
import { serverPb } from '@/lib/pocketbase/server';
import { BookOpenCheck, Pencil } from 'lucide-react';
import Link from 'next/link';
import ClientCourseTabs from './Tabs';
import EnrollButton from '@/components/courses/EnrollButton';
import CourseTile from '@/components/courses/CourseTile';

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
  const assignments = await pb
    .collection('assignments')
    .getFullList({ filter: `course="${courseid}"` });

  let isTeacher = false;
  // If the user is an admin automatically give them a link to studio
  if (pb.authStore.isAdmin) {
    isTeacher = true;
  } else {
    // If not check if they are a teacher of the course
    try {
      await pb
        .collection('teachers')
        .getFirstListItem(
          `course="${courseid}" && user="${pb.authStore.model?.id}"`,
        );
      isTeacher = true;
    } catch {}
  }

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
            <CourseTile course={course} className="w-60" />

            <div>
              <div className="mt-5 flex gap-5">
                <h1 className="text-4xl font-bold">{course.name}</h1>
                {isTeacher ? (
                  <Button variant="outline" asChild>
                    <Link
                      href={`/studio/course/${courseid}`}
                      className="mt-px flex gap-2"
                    >
                      <Pencil size={18} /> Edit in Studio
                    </Link>
                  </Button>
                ) : (
                  <EnrollButton courseid={course.id} />
                )}
              </div>
              <p className="mt-2 text-neutral-600">{course.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-md border bg-white p-5">
            <ClientCourseTabs
              course={course}
              pages={pages}
              assignments={assignments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
