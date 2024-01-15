'use client';

import CourseCompletionBar from '@/components/courses/CourseCompletionBar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { pb } from '@/lib/pocketbase/client';
import { EnrollmentsResponse, UsersResponse } from '@/lib/types/pocketbase';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Page({
  params: { courseid },
}: {
  params: { courseid: string };
}) {
  const [enrollments, setEnrollments] = useState<
    EnrollmentsResponse<{ user: UsersResponse }>[] | null
  >(null);

  useEffect(() => {
    pb.collection('enrollments')
      .getFullList<EnrollmentsResponse<{ user: UsersResponse }>>({
        filter: `course="${courseid}"`,
        expand: 'user',
      })
      .then((data) => setEnrollments(data))
      .catch(() => toast.error('Error fetching students.'));
  }, []);

  return (
    <main className="p-10">
      {enrollments ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Student Email</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments
              .map((enrollment) => enrollment.expand!.user)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <CourseCompletionBar complete={0} total={5} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <>loading...</>
      )}
    </main>
  );
}
