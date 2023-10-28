'use client';

import { pb } from '@/lib/pocketbase/client';

export default function Page() {
  return (
    <button
      onClick={() => {
        pb.collection('users').authWithOAuth2({ provider: 'google' });
      }}
    >
      sign in with goodle
    </button>
  );
}
