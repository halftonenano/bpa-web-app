import { GradeResponse, QuizType } from '@/components/quizzes/QuizType';
import { initAdminPb } from '@/lib/pocketbase/admin';

export const runtime = 'edge';

export async function POST(
  request: Request,
  { params: { quizid } }: { params: { quizid: string } },
) {
  const quiz = (await (await initAdminPb())
    .collection('quizzes')
    .getOne(quizid)) as QuizType;

  const answers = quiz.questions.map((question) => question.answer);
  const userSelection = await request.json();

  if (!Array.isArray(userSelection))
    return Response.json({ error: 'Invalid body format' }, { status: 400 });

  let score = 0;
  let correct = [];
  for (let i = 0; i < quiz.questions.length; i++) {
    if (userSelection[i] === answers[i]) {
      score++;
      correct.push(true);
    } else {
      correct.push(false);
    }
  }

  return Response.json({
    score,
    possible: quiz.questions.length,
    correct,
    // answers,
  } satisfies GradeResponse);
}
