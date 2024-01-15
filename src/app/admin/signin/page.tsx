'use client';

import MeshGradientRenderer from '@/components/MeshGradientRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pb } from '@/lib/pocketbase/client';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="fixed inset-0 overflow-hidden">
        <MeshGradientRenderer className="h-full md:w-full" />
      </div>
      <main className="relative grid min-h-screen place-items-center p-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <div className="font-bold">LearnX</div>
              <div className="font-normal">Administrator Sign In</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <Label htmlFor="email" className="ml-1">
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="example@learnxweb.com"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="password" className="ml-1">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>

              <Button
                className="mt-3 gap-2"
                disabled={loading}
                onClick={async () => {
                  if (email === '') {
                    return toast.error('Email cannot be empty');
                  }
                  if (password === '') {
                    return toast.error('Password cannot be empty');
                  }

                  try {
                    setLoading(true);
                    await pb.admins.authWithPassword(email, password);
                    router.push('/admin');
                    toast.success('Success!');
                  } catch {
                    setLoading(false);
                    toast.error('Invalid credientials');
                  }
                }}
              >
                Continue
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
