'use client';

import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/pocketbase/client';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <>
      <Button
        onClick={() => {
          signOut();
          router.push('/signin');
        }}
      >
        sign out
      </Button>
    </>
  );
}
