import { serverPb } from '@/lib/pocketbase/server';
import { marked } from 'marked';
import '@/components/pages/markdown.css';
import YouTube from 'react-youtube';
import YoutubeEmbed from '@/components/YoutubeEmbed';

export default async function Page({
  params: { pageid },
}: {
  params: { pageid: string[] };
}) {
  const page = await serverPb().collection('pages').getOne(pageid[0]);

  console.log(page);

  return (
    <main className="">
      <div className="mx-auto max-w-4xl p-10">
        <div className="mt-24">
          <h1 className="text-4xl font-bold">{page.title}</h1>
        </div>
        <hr className="my-10" />
        {page.video !== '' && (
          <>
            <YoutubeEmbed videoId={page.video} />
            <hr className="my-10" />
          </>
        )}
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{
            __html: marked.parse(page.content.replace(/(\\n)/g, '\n')),
          }}
        ></div>
      </div>
    </main>
  );
}
