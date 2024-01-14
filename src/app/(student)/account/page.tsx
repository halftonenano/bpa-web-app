'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { pb, signOut } from '@/lib/pocketbase/client';
import { UserCircle, UserMinus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthModel } from 'pocketbase';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Page() {
  const [model, setModel] = useState<AuthModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    console.log(pb.authStore.model);
    setModel(pb.authStore.model || null);
  }, []);

  const router = useRouter();

  return (
    <main className="p-10">
      <div className="flex items-center gap-5">
        <UserCircle size={50} strokeWidth={1.6} />
        <h1 className="text-2xl font-bold">Account</h1>
        <Button
          className="flex items-center gap-2 px-5"
          onClick={() => {
            signOut();
            router.push('/signin');
          }}
        >
          <UserMinus size={20} />
          Sign Out
        </Button>
      </div>
      <hr className="my-5" />

      {model ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            Email:
            <div className="w-fit rounded-full border px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
              {model.email}
            </div>
          </div>

          <Button
            className="w-fit"
            disabled={disabled}
            onClick={() => {
              setDisabled(true);
              toast.promise(
                pb.collection('users').requestPasswordReset(model.email),
                {
                  loading: 'Processing...',
                  success: `Password reset email sent to ${model.email}`,
                  error: 'Failed to send email',
                },
                { duration: 10000 },
              );
            }}
          >
            Reset password
          </Button>

          <hr className="my-2" />

          <div className="flex items-center gap-3">
            Joined on:
            <div className="w-fit rounded-full border px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
              {new Date(model.created).toDateString()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            User ID:
            <div className="w-fit rounded-full border px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
              {model.id}
            </div>
          </div>

          <hr className="my-2" />

          <AlertDialog>
            <Button className="w-fit" variant="destructive" asChild>
              <AlertDialogTrigger className="w-fit">
                Permanently delete my account
              </AlertDialogTrigger>
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    toast.promise(
                      new Promise<void>(async (resolve, reject) => {
                        try {
                          await pb.collection('users').delete(model.id);
                        } catch {
                          reject();
                        }
                        signOut();
                        await router.push('/signin');
                        resolve();
                      }),
                      {
                        loading: 'Deleting your account...',
                        success: `Your account has been deleted!`,
                        error: 'Something went wrong',
                      },
                      { duration: 10000 },
                    );
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        'You are not signed in'
      )}
    </main>
  );
}
