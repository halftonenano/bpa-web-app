import { serverPb } from '@/lib/pocketbase/server';
import { simplifyToSlug } from '@/lib/utils';
import { BookOpenCheck } from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

export default async function Page() {
  const pb = serverPb();
  const courses = await pb.collection('courses').getFullList();

  return (
    <main>
      <div className="flex flex-col gap-16 p-10 pt-40">
        {courses.map((course) => (
          <Link
            href={`/courses/${course.id}/${simplifyToSlug(course.name)}`}
            key={course.id}
          >
            <div className="group flex gap-7 rounded-md border p-7 shadow-sm transition duration-200 hover:bg-neutral-100">
              <div className="flex flex-shrink-0 flex-col gap-3">
                <div className="-mt-16">
                  {course.cover !== '' ? (
                    <img
                      className="h-40 w-40 rounded-md shadow-lg transition duration-300 ease-in-out group-hover:-translate-y-5 group-hover:shadow-2xl"
                      src={pb.files.getUrl(course, course.cover, {
                        thumb: '512x512',
                      })}
                    />
                  ) : (
                    <div
                      className="grid h-40 w-40 place-items-center rounded-md shadow-lg transition duration-300 ease-in-out group-hover:-translate-y-5 group-hover:shadow-2xl"
                      style={{ backgroundColor: course.color }}
                    >
                      <BookOpenCheck size={60} className="opacity-70" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">{course.name}</h3>
                <p className="text-neutral-600">{course.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
