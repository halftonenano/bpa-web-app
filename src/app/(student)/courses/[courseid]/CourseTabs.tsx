'use client';

import CourseCompletionBar from '@/components/courses/CourseCompletionBar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { pb } from '@/lib/pocketbase/client';
import {
  AssignmentsResponse,
  CompletionsResponse,
  CoursesResponse,
  PagesResponse,
} from '@/lib/types/pocketbase';
import { simplifyToSlug } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function ClientCourseTabs({
  course,
  pages,
  assignments,
}: {
  course: CoursesResponse;
  pages: PagesResponse[];
  assignments: AssignmentsResponse[];
}) {
  const [completions, setCompletions] = useState<CompletionsResponse[] | null>(
    null,
  );

  useEffect(() => {
    pb.collection('completions')
      .getFullList({ filter: `page.course="${course.id}"` })
      .then((data) => setCompletions(data));
  }, []);

  const numberComplete = useMemo(() => {
    if (!completions) return -1;
    let complete = 0;
    for (const page of pages) {
      if (completions.find((item) => item.page === page.id)) complete++;
    }
    return complete;
  }, [pages, completions]);

  return (
    <Tabs defaultValue="content">
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
      </TabsList>

      <hr className="my-3" />

      <TabsContent value="content">
        {pages.length > 0 ? (
          <>
            <div className="mb-3 flex gap-3">
              <CourseCompletionBar
                complete={numberComplete}
                total={pages.length}
                loading={numberComplete === -1}
              />

              {pages.length === numberComplete && (
                <Button variant="outline" asChild>
                  <Link href={`/courses/${course.id}/certificate`}>
                    Completion Certificate
                  </Link>
                </Button>
              )}
            </div>
            <ul>
              {pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${course.id}/page/${page.id}/${simplifyToSlug(
                    page.title,
                  )}`}
                >
                  <li className="flex items-center rounded-[0.5rem] px-4 py-2 transition hover:bg-neutral-200">
                    <span className="mr-2.5">
                      {!completions
                        ? '📘'
                        : completions.find((item) => item.page === page.id)
                        ? '✅'
                        : '📕'}
                    </span>
                    {page.title}
                  </li>
                </Link>
              ))}
            </ul>
          </>
        ) : (
          <div className="text-center">
            Hmm. There seems to be no course content here.
          </div>
        )}
      </TabsContent>

      <TabsContent value="assignments">
        {assignments.length > 0 ? (
          <ul>
            {assignments.map((assignment) => (
              <Link
                href={`/${course.id}/assignment/${assignment.id}`}
                key={assignment.id}
              >
                <li
                  className="rounded-[0.8rem] border p-5 pl-8 shadow-sm transition hover:bg-neutral-100"
                  key={assignment.id}
                >
                  <div className="flex justify-between">
                    <div className="text-xl font-bold">{assignment.title}</div>
                  </div>
                  <div className="mt-2 line-clamp-2 text-neutral-500">
                    {assignment.description}
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <div className="text-center">No assignments!</div>
        )}
      </TabsContent>
    </Tabs>
  );
}
