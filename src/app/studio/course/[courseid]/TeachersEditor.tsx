'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { pb } from '@/lib/pocketbase/client';
import {
  CoursesResponse,
  TeachersRecord,
  TeachersResponse,
  UsersResponse,
} from '@/lib/types/pocketbase';
import { Loader2, X } from 'lucide-react';
import router from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function TeachersEditor({ courseid }: { courseid: string }) {
  const [teachers, setTeachers] = useState<
    TeachersResponse<{ user: UsersResponse }>[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    pb.collection('teachers')
      .getFullList<TeachersResponse<{ user: UsersResponse }>>({
        filter: `course="${courseid}"`,
        expand: 'user',
      })
      .then((records) => {
        setTeachers(records);
      });
  }, []);

  return (
    <>
      <div className="my-2 flex gap-3">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teacher@learnxweb.com"
        />
        <Button
          className="flex gap-2"
          onClick={async () => {
            setLoading(true);
            try {
              const user = await pb
                .collection('users')
                .getFirstListItem(`email="${email}"`);

              const record = await pb.collection('teachers').create({
                user: user.id,
                course: courseid,
              } satisfies TeachersRecord);

              setTeachers([{ ...record, expand: { user } }, ...teachers]);
              toast.success(`Added ${email} as a teacher!`);
              setEmail('');
            } catch {
              toast.error(`Could not find user with email ${email}`);
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? (
            <>
              Adding...
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            'Add'
          )}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">User ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teaching) => (
            <TableRow key={teaching.id}>
              <TableCell className="font-medium">{teaching.user}</TableCell>
              <TableCell className="font-medium">
                {teaching.expand?.user.email || '[redacted]'}
              </TableCell>
              <TableCell>{teaching.updated}</TableCell>
              <TableCell>
                {teaching.expand?.user.id !== pb.authStore.model?.id && (
                  <button
                    onClick={async () => {
                      try {
                        await pb.collection('teachers').delete(teaching.id);

                        setTeachers([
                          ...teachers.filter((item) => item.id !== teaching.id),
                        ]);
                        toast.success(`Removed ${email}`);
                      } catch {
                        toast.error(`Something went wrong`);
                      }
                    }}
                  >
                    <X size={18} />
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
