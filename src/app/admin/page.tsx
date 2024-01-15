import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <Button variant="outline" asChild>
        <Link href="/admin/featured">Edit Featured Courses</Link>
      </Button>
    </>
  );
}
