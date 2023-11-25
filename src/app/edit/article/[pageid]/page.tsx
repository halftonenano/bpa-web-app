'use client';

import '@/components/pages/markdown.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pb } from '@/lib/pocketbase/client';
import { PagesResponse } from '@/lib/types/pocketbase';
import { marked } from 'marked';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactTextareaAutosize from 'react-textarea-autosize';

export default function Page({
  params: { pageid },
}: {
  params: { pageid: string };
}) {
  const [record, setRecord] = useState<PagesResponse | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    pb.collection('pages')
      .getOne(pageid)
      .then((value) => {
        setRecord(value);
        setContent(value.content.replace(/(\\n)/g, '\n'));
        setTitle(value.title);
        setIsLoading(false);
      });
  }, []);

  console.log(record);

  return (
    <div className="min-h-screen bg-neutral-50">
      {!isLoading ? (
        <>
          <div className="sticky top-0 bg-white p-3 shadow-md">
            <div className="flex items-center">
              <div className="flex w-full items-center justify-end gap-3">
                {record && (
                  <>
                    <Button asChild variant="outline">
                      <Link href={`/${record.course}/article/${record.id}`}>
                        Go to Page
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/edit/course/${record.course}`}>
                        Return to Editing Course
                      </Link>
                    </Button>
                  </>
                )}
                <Button
                  onClick={async () => {
                    toast.promise(
                      pb.collection('pages').update(pageid, { content, title }),
                      {
                        loading: 'Saving...',
                        success: 'Saved!',
                        error: 'Failed to Save',
                      },
                    );
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
          <div className="grid" style={{ gridTemplate: 'auto 1fr / 1fr 1fr' }}>
            <div className="m-10 cursor-not-allowed rounded-xl border bg-white p-14 shadow-lg">
              <div
                className="markdown-content"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(content),
                }}
              ></div>
            </div>
            <div className="h-full">
              <div className="p-10 pb-0">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    className="bg-white"
                    type="text"
                    id="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>
              <ReactTextareaAutosize
                className="h-full w-full resize-none overflow-visible bg-transparent p-10 leading-relaxed focus:outline-none"
                placeholder="Markdown content goes here!"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="grid h-screen place-items-center">
          Loading the editor and content...
        </div>
      )}
    </div>
  );
}
//
