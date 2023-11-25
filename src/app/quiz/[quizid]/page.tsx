import Quiz from '@/components/quizzes/Quiz';
import { QuizType } from '@/components/quizzes/QuizType';
import { initAdminPb } from '@/lib/pocketbase/admin';
import { serverPb } from '@/lib/pocketbase/server';
import { unset } from 'lodash-es';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

export default async function Page({
  params: { quizid },
}: {
  params: { quizid: string };
}) {
  // Check if the user has access to the quiz
  try {
    await serverPb().collection('quizzes').getOne(quizid);
  } catch {
    // Throw 404 if they don't
    notFound();
  }

  // Fetch full quiz data with admin client
  let quiz = (await (await initAdminPb())
    .collection('quizzes')
    .getOne(quizid)) as QuizType;

  quiz.questions = quiz.questions.map((item) => {
    unset(item, 'answer');
    return item;
  });

  console.log(quiz);

  return <Quiz quiz={quiz} />;
}
