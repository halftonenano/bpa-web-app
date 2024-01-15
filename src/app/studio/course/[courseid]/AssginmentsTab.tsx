import { Button } from '@/components/ui/button';
import { pb } from '@/lib/pocketbase/client';
import { AssignmentsRecord, AssignmentsResponse } from '@/lib/types/pocketbase';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StudioAssignmentsTab({
  courseid,
}: {
  courseid: string;
}) {
  const [assignments, setAssignments] = useState<AssignmentsResponse[] | null>(
    null,
  );
  const [creatingAssignment, setCreatingAssignment] = useState(false);

  useEffect(() => {
    pb.collection('assignments')
      .getFullList({ filter: `course="${courseid}"` })
      .then((records) => setAssignments(records));
  }, []);

  const router = useRouter();

  return (
    <>
      <ul>
        <Button
          className="mb-4 w-full bg-neutral-50"
          variant="outline"
          disabled={creatingAssignment}
          onClick={async () => {
            setCreatingAssignment(true);
            const newAssignment = await pb.collection('assignments').create({
              course: courseid,
              title: 'Untitled Assignment',
              description: '',
            } satisfies AssignmentsRecord);
            router.push(`/studio/assignment/${newAssignment.id}`);
          }}
        >
          {creatingAssignment ? (
            <>
              Creating assignment...
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            '+ Create assignment'
          )}
        </Button>

        {assignments &&
          assignments.map((assignment) => (
            <li
              className="rounded-[0.8rem] border p-5 pl-8 shadow-sm"
              key={assignment.id}
            >
              <div className="flex justify-between">
                <div className="text-xl font-bold">{assignment.title}</div>
                <div>
                  <Button variant="outline">
                    <Link
                      href={`/studio/assignment/${assignment.id}`}
                      prefetch={false}
                    >
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-2 line-clamp-2 text-neutral-500">
                {assignment.description}
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
