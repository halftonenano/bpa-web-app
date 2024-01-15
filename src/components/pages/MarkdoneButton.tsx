'use client';

import { Check, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase/client';
import toast from 'react-hot-toast';

export default function MarkdoneButton({
  pageid,
  automark,
  quizComplete,
}: {
  pageid: string;
  automark?: boolean;
  quizComplete?: boolean;
}) {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doneId, setDoneId] = useState('');
  const [notEnrolled, setNotEnrolled] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const record = await pb
          .collection('completions')
          .getFirstListItem(
            `page="${pageid} && user="${pb.authStore.model?.id}"`,
          );
        setDoneId(record.id);
      } catch {
        if (automark) await markDone();
      } finally {
        setInitialized(true);
      }
    })();
  }, [automark]);

  async function markDone() {
    if (!pb.authStore.model) return;
    try {
      const record = await pb.collection('completions').create({
        user: pb.authStore.model.id,
        page: pageid,
      });
      setLoading(false);
      setDoneId(record.id);
    } catch {
      setNotEnrolled(true);
    }
  }

  return (
    <>
      <Button
        variant={
          doneId !== '' || !initialized || quizComplete === false
            ? 'outline'
            : 'default'
        }
        className="flex gap-2"
        onClick={async () => {
          if (!pb.authStore.model) return;
          setLoading(true);
          if (doneId === '') {
            markDone();
          } else {
            try {
              await pb.collection('completions').delete(doneId);
              setLoading(false);
              setDoneId('');
            } catch {
              toast.error('Error unmarking page done');
            }
          }
        }}
        disabled={
          !initialized ||
          loading ||
          notEnrolled ||
          (quizComplete === false && doneId === '')
        }
      >
        {!initialized ? (
          <Loader2 size={20} className="animate-spin" />
        ) : notEnrolled ? (
          'Enroll in the course to mark stuff done'
        ) : (
          <>
            {doneId !== ''
              ? loading
                ? 'Unmarking Done...'
                : 'Unmark Done'
              : loading
              ? 'Marking Done...'
              : quizComplete === false
              ? 'Complete quiz to mark done'
              : 'Mark Done'}
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
