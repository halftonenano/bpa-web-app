'use client';

import { pb } from '@/lib/pocketbase/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export default function AccountWidget() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    setEmail(pb.authStore.model?.email);
    pb.authStore.onChange(() => setEmail(pb.authStore.model?.email));
  }, []);

  return (
    <Button
      asChild
      variant="outline"
      className="fixed left-3 top-3 z-50 bg-white"
    >
      <Link href="/signin">{!email || email === '' ? 'Sign In' : email}</Link>
    </Button>
  );
}
