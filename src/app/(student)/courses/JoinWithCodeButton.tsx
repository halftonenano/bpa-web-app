'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CoursesResponse } from '@/lib/types/pocketbase';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function JoinWithCodeButton() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  return (
    <Popover>
      <Button variant="outline" asChild>
        <PopoverTrigger>Join with code</PopoverTrigger>
      </Button>
      <PopoverContent>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ABCDE1"
        />
        <Button
          className="mt-3 flex w-full gap-2"
          onClick={async () => {
            setLoading(true);
            try {
              const course = (await (
                await fetch(`/api/courses/join/${code}`, {
                  method: 'POST',
                })
              ).json()) as CoursesResponse;
              if (!course.id) throw 'no course';
              router.push(`/studio/course/${course.id}`);
            } catch {
              toast.error('Could not find course');
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? (
            <>
              Joining...
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            'Join'
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
