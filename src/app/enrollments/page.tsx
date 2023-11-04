import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { serverPb } from '@/lib/pocketbase/server';
import { CoursesResponse, EnrollmentsResponse } from '@/lib/types/pocketbase';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export const runtime = 'edge';

export default async function Page() {
  const enrollments = await serverPb()
    .collection('enrollments')
    .getFullList<EnrollmentsResponse<{ course: CoursesResponse }>>({
      expand: 'course',
    });

  return (
    <>
      {enrollments.map((enrollment, index) => (
        <Card key={enrollment.expand?.course.id || index}>
          <CardHeader>
            <CardTitle>{enrollment.expand?.course.name}</CardTitle>
            <CardDescription>
              {enrollment.expand?.course.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/courses/${enrollment.expand?.course.id}`}>
                Open
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
