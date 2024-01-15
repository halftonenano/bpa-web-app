import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PagesResponse } from '@/lib/types/pocketbase';
import { Label } from '@radix-ui/react-label';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AddYoutubeEmbed({
  record,
  setRecord,
}: {
  record: PagesResponse;
  setRecord: any;
}) {
  const [input, setInput] = useState('');

  useEffect(() => {
    if (input.length === 11) {
      return setRecord({ ...record, video: input });
    } else {
      try {
        const url = new URL(input);

        if (
          url.hostname === 'www.youtube.com' ||
          url.hostname === 'youtube.com' ||
          url.hostname === 'm.youtube.com' ||
          url.hostname === 'youtu.be'
        ) {
          const v = url.searchParams.get('v');
          if (v) {
            setInput(v);
          }
        }
      } catch {}
      setRecord({ ...record, video: '' });
    }
  }, [input]);

  return (
    <div className="">
      <div className="flex gap-2">
        <Label htmlFor="video-input">Embed Video</Label>
        {input !== '' &&
          (input.length !== 11 ? (
            <div className="flex items-center gap-1 rounded-full bg-red-400 px-3 text-sm">
              <X size={16} />
              invalid youtube video ID
            </div>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-green-400 px-3 text-sm">
              <Check size={16} />
              valid video ID
            </div>
          ))}
        <span className="text-sm text-neutral-500 pointer-events-none">*must be a youtube link</span>
      </div>
      <Input
        id="video-input"
        className="mt-2"
        placeholder="youtube.com/watch?v=abcd"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
}

// http://youtube.com/oembed?url=${videoUrl}&format=json
