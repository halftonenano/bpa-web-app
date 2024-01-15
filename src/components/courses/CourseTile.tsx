import { CoursesResponse } from '@/lib/types/pocketbase';
import { cn } from '@/lib/utils';
import { BookOpenCheck } from 'lucide-react';

export default function CourseTile({
  course,
  className,
  children,
}: {
  course: CoursesResponse;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="">
      <div
        className={cn(
          'grid aspect-square w-40 place-items-center rounded-[0.5rem] text-5xl shadow-lg transition duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl',
          className,
        )}
        style={{
          backgroundColor: course.color,
        }}
      >
        {course.icon ? (
          <div className={cn(isASCII(course.icon) && 'opacity-70')}>
            {course.icon}
          </div>
        ) : (
          <BookOpenCheck size={55} className="opacity-70" />
        )}
        {children}
      </div>
    </div>
  );
}

function isASCII(string: string) {
  return /^[\x00-\xFF]*$/.test(string);
}
