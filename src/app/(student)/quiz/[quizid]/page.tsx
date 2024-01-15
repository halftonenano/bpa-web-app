import Quiz from '@/components/quizzes/Quiz';
import ServerSideQuiz from '@/components/quizzes/QuizServerSide';
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

  return <ServerSideQuiz quizid={quizid} />;
}
