'use client';

import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { pb } from '@/lib/pocketbase/client';

export default function EnrollButton({ courseid }: { courseid: string }) {
  return (
    <Button
      onClick={() => {
        toast.promise(
          pb
            .collection('enrollments')
            .create({ user: pb.authStore.model?.id, course: courseid }),
          {
            loading: 'Enrolling...',
            error: 'Failed',
            success: 'Successfully Enrolled!',
          },
          { className: 'text-sm font-bold' },
        );
      }}
    >
      Enroll
    </Button>
  );
}
