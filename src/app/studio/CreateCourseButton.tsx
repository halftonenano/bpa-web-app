'use client';

import { Button } from '@/components/ui/button';
import { CoursesResponse } from '@/lib/types/pocketbase';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CreateCourseButton() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  return (
    <Button
      className="flex gap-2"
      variant="outline"
      onClick={async () => {
        setLoading(true);
        try {
          const course = (await (
            await fetch('/api/courses/create', {
              method: 'POST',
            })
          ).json()) as CoursesResponse;
          router.push(`/studio/course/${course.id}`);
        } catch {
          toast.error('Something went wrong');
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? (
        <>
          Creating course...
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </>
      ) : (
        '+ New course'
      )}
    </Button>
  );
}
