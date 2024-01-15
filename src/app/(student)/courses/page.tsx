import { serverPb } from '@/lib/pocketbase/server';
import { Library, Star } from 'lucide-react';
import ClientMyCourses from './ClientMyCourses';
import CourseCard from './CourseCard';

export const runtime = 'edge';

export default async function Page() {
  const pb = serverPb();
  const featured = await pb.collection('courses').getFullList({
    filter: 'featured=true',
  });

  return (
    <main>
      <div className="min-h-[70vh] p-10">
        <ShelfHeader icon={<Library size={35} />}>My Courses</ShelfHeader>
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

function ShelfHeader({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <h2 className="text-2xl font-bold">{children}</h2>
    </div>
  );
}
