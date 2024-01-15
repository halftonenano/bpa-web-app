import SubmissionEditor from '@/components/assignments/SubmissionEditor';
import { serverPb } from '@/lib/pocketbase/server';

export const runtime = 'edge';

export default async function Page({
  params: { assignmentid },
}: {
  params: { assignmentid: string };
}) {
  const pb = serverPb();

  const assignment = await pb.collection('assignments').getOne(assignmentid);

  console.log(assignment);

  return (
    <main className="">
      <div className="mx-auto max-w-4xl p-10">
        <div className="streak-text">ASSIGNMENT</div>
        <div className="mt-10 flex items-center gap-3">
          <h1 className="text-4xl font-bold">{assignment.title}</h1>
        </div>
        <hr className="my-10" />

        <div className="whitespace-pre-line p-5 pb-10 pt-0 text-neutral-800">
          {assignment.description}
        </div>

        {pb.authStore.model?.id ? (
          <SubmissionEditor assignmentid={assignment.id} />
        ): <div className='p-10 text-center font-bold bg-white border shadow-sm rounded-sm pointer-events-none'>You need to be signed in to submit assignments</div>}
      </div>
    </main>
  );
}
