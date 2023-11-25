'use client';

import { Button } from '@/components/ui/button';
import { pb } from '@/lib/pocketbase/client';
import Image from 'next/image';
import GoogleLogo from './google.svg';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <main className="grid min-h-screen place-items-center">
      <div>
        <h1 className="text-7xl font-bold">LearnX</h1>
        <Button
          variant="outline"
          className="mt-2 flex w-full gap-2"
          onClick={async () => {
            await pb.collection('users').authWithOAuth2({ provider: 'google' });
            router.push('/courses');
          }}
        >
          <Image width={22} src={GoogleLogo} alt="google logo" />
          Continue with Google
        </Button>
      </div>
    </main>
  );
}
