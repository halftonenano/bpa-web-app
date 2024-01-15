import YoutubeEmbed from '@/components/YoutubeEmbed';
import MarkdoneButton from '@/components/pages/MarkdoneButton';
import SanitizedMarkdownRenderer from '@/components/pages/SanitizedMarkdownRenderer';
import ServerSideQuiz from '@/components/quizzes/QuizServerSide';
import { serverPb } from '@/lib/pocketbase/server';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

export default async function Page({
  params: { pageid },
}: {
  params: { pageid: string };
}) {
  const page = await serverPb()
    .collection('pages')
    .getOne(pageid)
    .catch(() => notFound());

  return (
    <main className="">
      <div className="mx-auto max-w-4xl p-10">
        <div className="mt-10">
          <h1 className="text-4xl font-bold">{page.title}</h1>
        </div>
        <hr className="my-10" />

        {page.video !== '' && (
          <>
            <YoutubeEmbed videoId={page.video} />
            <hr className="my-10" />
          </>
        )}

        <SanitizedMarkdownRenderer content={page.content} />

        {page.quiz ? (
          <div>
            <ServerSideQuiz quizid={page.quiz} pageid={pageid} />
          </div>
        ) : (
          <>
            <hr className="my-8" />
            <MarkdoneButton pageid={pageid} automark />
          </>
        )}
      </div>
    </main>
  );
}
