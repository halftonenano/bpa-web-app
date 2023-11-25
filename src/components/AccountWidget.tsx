'use client';

import { pb } from '@/lib/pocketbase/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AccountWidget() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    setEmail(pb.authStore.model?.email);
    pb.authStore.onChange(() => setEmail(pb.authStore.model?.email));
  }, []);

  return (
    <Link href="/signin" style={{ writingMode: 'vertical-rl' }}>
      <div className="mt-10 rounded-md border py-2 pl-1 text-sm shadow-md transition hover:bg-neutral-100">
        {!email || email === '' ? 'Sign In' : email}
      </div>
    </Link>
  );
}
