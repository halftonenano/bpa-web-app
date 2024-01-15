import Quiz from '@/components/quizzes/Quiz';
import { QuizType } from '@/components/quizzes/QuizType';
import { initAdminPb } from '@/lib/pocketbase/admin';
import { unset } from 'lodash-es';
import 'server-only';

export default async function ServerSideQuiz({
  quizid,
  pageid,
}: {
  quizid: string;
  pageid?: string;
}) {
  // Fetch full quiz data with admin client
  let quiz = (await (await initAdminPb())
    .collection('quizzes')
    .getOne(quizid)) as QuizType;

  // ! Remove the answers from the quiz data before sending to the client
  quiz.questions = quiz.questions.map((item) => {
    unset(item, 'answer');
    return item;
  });

  return <Quiz quiz={quiz} pageid={pageid} />;
}
