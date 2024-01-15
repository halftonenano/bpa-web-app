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
import {
  CompletionsResponse,
  EnrollmentsResponse,
  PagesResponse,
  UsersResponse,
} from '@/lib/types/pocketbase';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const runtime = 'edge';

export default function Page({
  params: { courseid },
}: {
  params: { courseid: string };
}) {
  const [enrollments, setEnrollments] = useState<
    EnrollmentsResponse<{ user: UsersResponse }>[] | null
  >(null);

  const [completions, setCompletions] = useState<CompletionsResponse[] | null>(
    null,
  );

  const [pages, setPages] = useState<PagesResponse[] | null>(null);

  const totalPossible = pages?.length || 0;

  useEffect(() => {
    pb.collection('enrollments')
      .getFullList<EnrollmentsResponse<{ user: UsersResponse }>>({
        filter: `course="${courseid}"`,
        expand: 'user',
      })
      .then((data) => setEnrollments(data))
      .catch(() => toast.error('Error fetching students.'));

    pb.collection('completions')
      .getFullList({
        filter: `page.course="${courseid}"`,
      })
      .then((data) => setCompletions(data))
      .catch(() => toast.error('Error fetching student completions.'));

    pb.collection('pages')
      .getFullList({
        filter: `course="${courseid}"`,
      })
      .then((data) => setPages(data))
      .catch(() => toast.error('Error fetching course pages.'));
  }, []);

  return (
    <main className="p-10">
      {enrollments ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Student Email</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments
              .map((enrollment) => enrollment.expand!.user)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    {completions ? (
                      <CourseCompletionBar
                        complete={
                          completions.filter(
                            (completion) => completion.user === user.id,
                          ).length
                        }
                        total={totalPossible}
                      />
                    ) : (
                      'loading progress...'
                    )}
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
