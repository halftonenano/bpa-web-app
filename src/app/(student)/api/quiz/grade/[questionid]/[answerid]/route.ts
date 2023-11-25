import { initAdminPb } from '@/lib/pocketbase/admin';

export const runtime = 'edge';

export async function POST(
  request: Request,
  {
    params: { questionid, answerid },
  }: { params: { questionid: string; answerid: string } },
) {
  const question = await (await initAdminPb())
    .collection('questions')
    .getOne(questionid);

  return Response.json({
    grade: question.answer === answerid ? 'correct' : 'incorrect',
  });
}
