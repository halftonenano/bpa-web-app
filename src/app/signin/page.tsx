'use client';

import { Button } from '@/components/ui/button';
import { pb } from '@/lib/pocketbase/client';
import Image from 'next/image';
import GoogleLogo from './google.svg';
import { useRouter } from 'next/navigation';
import MeshGradientRenderer from '@/components/MeshGradientRenderer';

export default function Page() {
  const router = useRouter();

  return (
    <>
      <div className="absolute h-screen w-full overflow-hidden">
        <MeshGradientRenderer className="h-full md:w-full" />
      </div>
      <main className="relative grid min-h-screen place-items-center">
        <div>
          <h1 className="text-7xl font-bold">LearnX</h1>
          <Button
            variant="outline"
            className="mt-2 flex w-full gap-2 bg-white"
            onClick={async () => {
              await pb
                .collection('users')
                .authWithOAuth2({ provider: 'google' });
              router.push('/courses');
            }}
          >
            <Image width={20} src={GoogleLogo} alt="google logo" />
            Continue with Google
          </Button>
        </div>
      </main>
    </>
  );
}
