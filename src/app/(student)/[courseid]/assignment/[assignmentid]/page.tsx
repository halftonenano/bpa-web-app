import SubmissionEditor from '@/components/assignments/SubmissionEditor';
import { serverPb } from '@/lib/pocketbase/server';

export const runtime = 'edge';

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
        <div className="streak-text">ASSIGNMENT</div>
        <div className="mt-10 flex items-center gap-3">
          <h1 className="text-4xl font-bold">{assignment.title}</h1>
        </div>
        <hr className="my-10" />

        <div className="whitespace-pre-line p-5 pb-10 pt-0 text-neutral-800">
          {assignment.description}
        </div>

        <SubmissionEditor assignmentid={assignment.id} />
      </div>
    </main>
  );
}
