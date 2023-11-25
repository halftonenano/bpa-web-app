import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center">
      <div>
        <h1 className="text-7xl font-bold">LearnX</h1>
        <p>BPA Web App Competition</p>
        <Button asChild variant='outline' className='w-full mt-2'>
          <Link className="" href="/courses">
            continue to courses →
          </Link>
        </Button>
      </div>
    </main>
  );
}
