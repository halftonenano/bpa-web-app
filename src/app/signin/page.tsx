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
import GoogleLogo from './google.svg';
import DiscordLogo from './discord.svg';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [createAccount, setCreateAccount] = useState(false);

  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="fixed inset-0 overflow-hidden">
        <MeshGradientRenderer className="h-full md:w-full" />
      </div>
      <main className="relative grid min-h-screen place-items-center p-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              {createAccount ? 'Create an Account' : 'Sign In'}
            </CardTitle>
            {/* <CardDescription></CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex w-full gap-2 bg-white"
                onClick={async () => {
                  await pb.collection('users').authWithOAuth2({
                    provider: 'google',
                    createData: { emailVisibility: true },
                  });
                  router.push('/courses');
                }}
              >
                <Image width={20} src={GoogleLogo} alt="google logo" />
                Google
              </Button>
              <Button
                variant="outline"
                className="flex w-full gap-2 bg-white"
                onClick={async () => {
                  await pb
                    .collection('users')
                    .authWithOAuth2({
                      provider: 'discord',
                      createData: { emailVisibility: true },
                    });
                  router.push('/courses');
                }}
              >
                <Image width={20} src={DiscordLogo} alt="discord logo" />
                Discord
              </Button>
            </div>

            <hr className="my-5" />

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
              {createAccount && (
                <div>
                  <Label htmlFor="password-confirm" className="ml-1">
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    id="password-confirm"
                    placeholder="Confirm password"
                    value={passwordConfirm}
                    onChange={(e) => {
                      setPasswordConfirm(e.target.value);
                    }}
                  />
                </div>
              )}
              <Button
                className="mt-3"
                disabled={loading}
                onClick={async () => {
                  if (email === '') {
                    return toast.error('Email cannot be empty');
                  }
                  if (password === '') {
                    return toast.error('Password cannot be empty');
                  }
                  if (createAccount) {
                    // For account creation check if passwords match
                    if (password !== passwordConfirm) {
                      return toast.error('Passwords do not match');
                    }
                    if (password.length < 8) {
                      return toast.error(
                        'Passwords must be longer than 8 characters',
                      );
                    }
                    try {
                      setLoading(true);
                      await pb.collection('users').create({
                        email,
                        password,
                        passwordConfirm,
                        emailVisibility: true,
                      });
                      await pb.collection('users').requestVerification(email);
                      await pb
                        .collection('users')
                        .authWithPassword(email, password);
                      return toast.success('Success!');
                    } catch (e) {
                      setLoading(false);
                      return toast.error(
                        // @ts-ignore
                        e.data.data.email.message ||
                          // @ts-ignore
                          e.data.data.password.message ||
                          'Something went wrong',
                      );
                    }
                  } else {
                    try {
                      setLoading(true);
                      await pb
                        .collection('users')
                        .authWithPassword(email, password);
                      return toast.success('Success!');
                    } catch {
                      setLoading(false);
                      return toast.error('Invalid credientials');
                    }
                  }
                }}
              >
                {createAccount ? 'Create Account' : 'Continue'}
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>

            <div className="mt-2 text-center">
              <Button
                variant="link"
                onClick={() => {
                  setCreateAccount((prev) => !prev);
                }}
              >
                {createAccount ? 'Back to sign in' : 'Create an account'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
