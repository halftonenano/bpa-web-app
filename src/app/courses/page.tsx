import EnrollButton from '@/components/courses/EnrollButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { serverPb } from '@/lib/pocketbase/server';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const runtime = 'edge';

export default async function Page() {
  const courses = await serverPb().collection('courses').getFullList();

  return (
    <main>
      <div className="flex flex-col gap-3 p-5">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button asChild variant="link" className="flex gap-2">
                  <Link
                    href={`/courses/${course.id}/${course.name
                      .toLowerCase()
                      .replace(' ', '-')
                      .replace(/[^0-9a-zA-Z_-]/g, '')}`}
                  >
                    Preview
                    <ExternalLink size={14} />
                  </Link>
                </Button>
                <EnrollButton courseid={course.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
