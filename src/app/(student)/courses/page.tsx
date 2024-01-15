import { serverPb } from '@/lib/pocketbase/server';
import { Library, Star } from 'lucide-react';
import ClientMyCourses from './ClientMyCourses';
import CourseCard from './CourseCard';
import ShelfHeader from './CourseShelfHeader';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import JoinWithCodeButton from './JoinWithCodeButton';

export const runtime = 'edge';

export default async function Page() {
  const pb = serverPb();
  const featured = await pb.collection('courses').getFullList({
    filter: 'featured=true',
    sort: '-updated',
  });

  return (
    <main>
      <div className="min-h-[70vh] p-10">
        <div className="flex items-center gap-3">
          <Library size={35} />
          <h2 className="text-2xl font-bold">Enrolled Courses</h2>
          <JoinWithCodeButton />
        </div>
        <div className="mt-5 flex flex-wrap gap-4">
          <ClientMyCourses />
        </div>
      </div>
      <hr className="" />
      <div className="p-10">
        <ShelfHeader icon={<Star size={33} />}>Featured Courses</ShelfHeader>
        <div className="mt-5 flex flex-wrap gap-4">
          {featured.map((course) => (
            <CourseCard course={course} key={course.id} />
          ))}
        </div>
      </div>
    </main>
  );
}
