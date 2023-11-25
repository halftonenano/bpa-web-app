import { Button } from '@/components/ui/button';
import { serverPb } from '@/lib/pocketbase/server';
import { simplifyToSlug } from '@/lib/utils';
import Link from 'next/link';

export default async function Layout({
  children,
  params: { courseid },
}: {
  children: React.ReactNode;
  params: { courseid: string };
}) {
  const course = await serverPb().collection('courses').getOne(courseid);
  const pages = await serverPb()
    .collection('pages')
    .getFullList({ filter: `course="${courseid}"` });

  return (
    <div className="grid" style={{ gridTemplate: '1fr / auto 1fr' }}>
      <div className="sticky top-0 h-screen border-r shadow-inner">
        <div className="p-10">
          <div className="text-xl font-bold">{course.name}</div>
          <Button asChild variant="outline" className="mt-2 w-full">
            <Link
              className=""
              href={`/courses/${course.id}/${simplifyToSlug(course.name)}`}
            >
              Course Home
            </Link>
          </Button>

          <ul className="py-10">
            {pages.map((page) => (
              <li key={page.id}>
                <Button asChild variant="link">
                  <Link
                    key={page.id}
                    href={`/${course.id}/page/${page.id}/${simplifyToSlug(
                      page.title,
                    )}`}
                  >
                    {page.title}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {children}
    </div>
  );
}
