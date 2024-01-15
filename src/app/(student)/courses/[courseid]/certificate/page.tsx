import CourseCompletionBar from '@/components/courses/CourseCompletionBar';
import { Button } from '@/components/ui/button';
import { serverPb } from '@/lib/pocketbase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;
export const runtime = 'edge';

export default async function Page({
  params: { courseid },
}: {
  params: { courseid: string };
}) {
  const pb = serverPb();

  const course = await pb
    .collection('courses')
    .getOne(courseid)
    .catch(() => notFound());
  const pages = await pb
    .collection('pages')
    .getFullList({ filter: `course="${courseid}"` });
  const completions = await pb
    .collection('completions')
    .getFullList({ filter: `page.course="${course.id}"` });

  let complete = 0;
  for (const page of pages) {
    if (completions.find((item) => item.page === page.id)) complete++;
  }

  if (pages.length !== complete) {
    return (
      <main className="grid min-h-full place-items-center">
        <div className="text-center">
          You have not completed the course yet
          <CourseCompletionBar complete={complete} total={pages.length} />
          <Button variant="outline" asChild>
            <Link href={`/courses/${course.id}`}>Return to course</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-10">
      <Link
        className="text-sm text-neutral-600 underline-offset-2 hover:underline"
        href={`/courses/${course.id}`}
      >
        ← return to course
      </Link>
      <div className="streak mx-auto w-fit rounded-sm p-20">
        <div className="overflow-hidden rounded-[0.8rem] shadow-lg">
          <div className="h-[34rem] w-[44rem] bg-white p-4" id="certificate">
            <div className="streak rounded-[0.7rem] p-10">
              <h4 className="mb-10 text-right text-xl font-bold">LearnX</h4>
              <h1 className="text-center text-3xl font-light">
                Certificate of Completion
              </h1>
              <h2 className="mt-3 text-center text-4xl font-bold">
                {course.name}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
