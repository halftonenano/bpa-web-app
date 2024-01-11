'use client';

import { Button } from '@/components/ui/button';
import { pb } from '@/lib/pocketbase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // Check if user's session is still valid and if so set the cookie to the refreshed token or if not then sent them to the login page
      if (pb.authStore.isValid) {
        await pb.collection('users').authRefresh();

        document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
        router.push(new URLSearchParams(location.search).get('after') || '');
      } else {
        return router.push(`/signin${location.search}`);
      }
    })();
  }, []);

  return (
    <main className="grid min-h-screen place-items-center">
      <div>
        <h1 className="text-7xl font-bold">LearnX</h1>
        Authenticating...
      </div>
    </main>
  );
}
