import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <main className='p-10'>
      <Button variant="outline" asChild>
        <Link href="/admin/featured">Edit Featured Courses</Link>
      </Button>
    </main>
  );
}
