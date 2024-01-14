import EditSubmission from '@/components/assignments/EditSubmission';
import { serverPb } from '@/lib/pocketbase/server';
import { Upload } from 'lucide-react';

export default async function Page({
  params: { assignmentid },
}: {
  params: { assignmentid: string };
}) {
  const assignment = await serverPb()
    .collection('assignments')
    .getOne(assignmentid);

  console.log(assignment);

  return (
    <main className="">
      <div className="mx-auto max-w-4xl p-10">
        <div className='streak-text'>ASSIGNMENT</div>
        <div className="mt-10 flex items-center gap-3">
          <h1 className="text-4xl font-bold">{assignment.title}</h1>
        </div>
        <hr className="my-10" />

        <div className="p-5 pb-10 pt-0 text-neutral-800">
          {assignment.description}
        </div>

        <EditSubmission assignmentid={assignment.id} />
      </div>
    </main>
  );
}
