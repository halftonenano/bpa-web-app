import CourseTile from '@/components/courses/CourseTile';
import { CoursesResponse } from '@/lib/types/pocketbase';
import { simplifyToSlug } from '@/lib/utils';
import Link from 'next/link';

export default function CourseCard({ course }: { course: CoursesResponse }) {
  return (
    <Link
      className="w-[calc(50%_-_0.5rem)]"
      href={`/courses/${course.id}/${simplifyToSlug(course.name)}`}
      prefetch={false}
    >
      <div className="group flex gap-7 rounded-[0.5rem] border p-4 shadow-sm transition duration-200 hover:bg-neutral-100">
        <div className="flex flex-shrink-0 flex-col gap-3">
          <CourseTile course={course} />
        </div>
        <div className="w-full">
          <h3 className="text-xl font-bold">{course.name}</h3>
          <hr className="my-2 w-full" />
          <p className="text-neutral-600">{course.description}</p>
        </div>
      </div>
    </Link>
  );
}
