'use client';

import { Check, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase/client';
import toast from 'react-hot-toast';
import { EnrollmentsRecord } from '@/lib/types/pocketbase';

export default function EnrollButton({ courseid }: { courseid: string }) {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enrollmentId, setEnrollmentiId] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const record = await pb
          .collection('enrollments')
          .getFirstListItem(
            `course="${courseid}" && user="${pb.authStore.model?.id}"`,
          );
        setEnrollmentiId(record.id);
      } catch {
      } finally {
        setInitialized(true);
      }
    })();
  }, []);

  async function enroll() {
    if (!pb.authStore.model) return;
    try {
      const record = await pb.collection('enrollments').create({
        user: pb.authStore.model.id,
        course: courseid,
      } satisfies EnrollmentsRecord);
      setLoading(false);
      setEnrollmentiId(record.id);
    } catch {
      toast.error('Error enrolling');
    }
  }

  return (
    <>
      <Button
        variant={enrollmentId !== '' || !initialized ? 'outline' : 'default'}
        className="flex gap-2"
        onClick={async () => {
          if (!pb.authStore.model) return;
          setLoading(true);
          if (enrollmentId === '') {
            enroll();
          } else {
            try {
              await pb.collection('enrollments').delete(enrollmentId);
              setLoading(false);
              setEnrollmentiId('');
            } catch {
              toast.error('Error unmarking page done');
            }
          }
        }}
        disabled={!initialized || loading}
      >
        {!initialized ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>
            {enrollmentId !== ''
              ? loading
                ? 'Unenrolling...'
                : 'Unenroll'
              : loading
              ? 'Enrolling...'
              : 'Enroll'}
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Check size={20} />
            )}
          </>
        )}
      </Button>
    </>
  );
}
