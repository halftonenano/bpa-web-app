'use client';

import CourseCard from '@/app/(student)/courses/CourseCard';
import ShelfHeader from '@/app/(student)/courses/CourseShelfHeader';
import UniversalPicker from '@/components/UniversalPicker';
import { Button } from '@/components/ui/button';
import { pb } from '@/lib/pocketbase/client';
import { CoursesResponse } from '@/lib/types/pocketbase';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Page() {
  const [featured, setFeatured] = useState<CoursesResponse[]>([]);
  useEffect(() => {
    refreshCourses();
  }, []);

  const [selected, setSelected] = useState('');

  async function refreshCourses() {
    const data = await pb
      .collection('courses')
      .getFullList({
        filter: 'featured=true',
      })
      .catch((e) => {
        toast.error(e.data.message);
      });
    if (data) {
      setFeatured(data);
    }
  }

  return (
    <main>
      <div className="flex items-center gap-3 p-10">
        <UniversalPicker
          type="courses"
          property="name"
          filter="public=true"
          className="w-[20rem]"
          setSelectedId={setSelected}
        />
        <Button
          onClick={async () => {
            toast.promise(
              new Promise<void>(async (resolve, reject) => {
                try {
                  await pb
                    .collection('courses')
                    .update(selected, { featured: true });
                  await refreshCourses();
                  resolve();
                } catch {
                  reject();
                }
              }),
              {
                loading: 'Updating...',
                success: 'Updated!',
                error: 'Failed to update.',
              },
            );
          }}
          disabled={selected === ''}
        >
          Add
        </Button>
        <span className="pointer-events-none text-sm text-neutral-500">
          *course must be public
        </span>
      </div>
      <hr className="" />
      <div className="p-10">
        <ShelfHeader icon={<Star size={33} />}>Featured Courses</ShelfHeader>
        <div className="mt-5 flex flex-wrap gap-4">
          {featured.map((course) => (
            <>
              <div className="relative w-full">
                <CourseCard course={course} key={course.id} />
                <Button
                  className="mt-3"
                  variant={'outline'}
                  onClick={async () => {
                    toast.promise(
                      new Promise<void>(async (resolve, reject) => {
                        try {
                          await pb
                            .collection('courses')
                            .update(course.id, { featured: false });
                          await refreshCourses();
                          resolve();
                        } catch {
                          reject();
                        }
                      }),
                      {
                        loading: 'Updating...',
                        success: 'Updated!',
                        error: 'Failed to update.',
                      },
                    );
                  }}
                >
                  Remove
                </Button>
              </div>
              <hr className="my-3" />
            </>
          ))}
        </div>
      </div>
    </main>
  );
}
