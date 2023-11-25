import { initAdminPb } from '@/lib/pocketbase/admin';
import { serverPb } from '@/lib/pocketbase/server';
import { QuestionsResponse, QuizzesResponse } from '@/lib/types/pocketbase';
import { notFound } from 'next/navigation';
import { unset } from 'lodash-es';
import Quiz from '@/components/quizzes/Quiz';
import { QuizType } from '@/components/quizzes/QuizType';

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
