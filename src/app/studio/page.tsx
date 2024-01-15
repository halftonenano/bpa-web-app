import { Library } from 'lucide-react';
import ShelfHeader from '../(student)/courses/CourseShelfHeader';
import { pb } from '@/lib/pocketbase/client';
import { serverPb } from '@/lib/pocketbase/server';
import { CoursesResponse, TeachersResponse } from '@/lib/types/pocketbase';
import CourseCard from '../(student)/courses/CourseCard';
import { Button } from '@/components/ui/button';
import CreateCourseButton from './CreateCourseButton';

export default async function Page() {
  const pb = serverPb();

  const teaching = await pb
    .collection('teachers')
    .getFullList<TeachersResponse<{ course: CoursesResponse }>>({
      filter: `user="${pb.authStore.model?.id}"`,
      expand: 'course',
    });

  const courses = teaching
    .filter((record) => !!record.expand)
    .map((record) => record.expand!.course);

  return (
    <main>
      <div className="min-h-[70vh] p-10">
        <div className="flex items-center gap-5">
          <Library size={35} />
          <h2 className="text-2xl font-bold">My Courses</h2>
          <CreateCourseButton />
        </div>

        <div className="mt-5 flex flex-wrap gap-4">
          <div className="mt-5 flex flex-wrap gap-4">
            {courses.map((course) => (
              <CourseCard course={course} key={course.id} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
