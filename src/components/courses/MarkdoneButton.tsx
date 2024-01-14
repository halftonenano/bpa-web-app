'use client';

import { Check, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase/client';
import toast from 'react-hot-toast';

export default function MarkdoneButton({
  pageid,
  automark,
}: {
  pageid: string;
  automark?: boolean;
}) {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doneId, setDoneId] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const record = await pb
          .collection('completions')
          .getFirstListItem(`page="${pageid}"`);
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
      toast.error('Error marking page done');
    }
  }

  return (
    <>
      <Button
        variant={doneId !== '' ? 'outline' : 'default'}
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
        disabled={!initialized || loading}
      >
        {!initialized ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>
            {doneId !== ''
              ? loading
                ? 'Unmarking Done...'
                : 'Unmark Done'
              : loading
              ? 'Marking Done...'
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
