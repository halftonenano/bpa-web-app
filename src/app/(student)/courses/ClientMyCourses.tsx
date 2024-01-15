'use client';

import { pb } from '@/lib/pocketbase/client';
import { CoursesResponse, EnrollmentsResponse } from '@/lib/types/pocketbase';
import { useEffect, useState } from 'react';
import CourseCard from './CourseCard';

export default function ClientMyCourses() {
  const [courses, setCourses] = useState<CoursesResponse[] | null>(null);

  useEffect(() => {
    pb.collection('enrollments')
      .getFullList<EnrollmentsResponse<{ course: CoursesResponse }>>({
        expand: 'course',
      })
      .then((data) =>
        setCourses(
          data
            .filter((enrollment) => !!enrollment.expand)
            .map((enrollment) => enrollment.expand!.course),
        ),
      );
  }, []);

  if (!courses) return 'Fetching your courses...';
  return (
    <>
      {courses.map((course, index) => (
        <>
          <CourseCard course={course} key={index} />
        </>
      ))}
    </>
  );
}
