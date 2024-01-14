'use client';

import {
  CheckCircle,
  CheckCircle2,
  FileIcon,
  FilePlus,
  FileText,
  Loader2,
  X,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { pb } from '@/lib/pocketbase/client';
import toast from 'react-hot-toast';

export default function EditSubmission({
  assignmentid,
}: {
  assignmentid: string;
}) {
  const [loading, setLoading] = useState(false);

  const [fileDescriptions, setFileDescriptions] = useState<
    { name: string; size: number; type: string }[]
  >([]);
  const files = useRef<File[]>([]);
  const [title, setTitle] = useState('');
  const [done, setDone] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    files.current.push(...acceptedFiles);

    setFileDescriptions([
      ...fileDescriptions,
      ...acceptedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    ]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div
        className={cn(
          'streak-bold grid gap-1.5 rounded-[0.9rem] p-1.5 shadow-md',
          loading && 'pointer-events-none blur-sm',
        )}
      >
        {!done ? (
          <>
            <div className="flex w-full items-center rounded-[0.625rem] bg-white pl-4 text-sm transition hover:-translate-y-0.5 hover:bg-neutral-100">
              <span className="flex-shrink-0">Submission Title:</span>
              <input
                className="w-full bg-transparent px-2 py-2 focus:outline-none"
                placeholder="Optional"
                disabled={loading}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex gap-1.5">
              <div className="flex w-full flex-col overflow-hidden rounded-[0.625rem] bg-white">
                <ul className="h-full py-2">
                  {fileDescriptions.length === 0 && (
                    <span className="grid h-full place-items-center text-sm text-neutral-400">
                      Attachments will appear here
                    </span>
                  )}
                  {fileDescriptions.map((file, index) => (
                    <li className="flex w-full items-start justify-between gap-2 px-3 py-1.5 hover:bg-neutral-100">
                      <div className="pointer-events-none flex w-[calc(100%_-_3rem)] gap-2 whitespace-pre-line break-words pr-3 text-sm">
                        <FileText
                          className="mt-0.5 flex-shrink-0"
                          size={20}
                          strokeWidth={1.2}
                        />
                        <div className="mt-0.5 w-full">{file.name}</div>
                      </div>
                      <button
                        className="flex-shrink-0"
                        onClick={() => {
                          const temp = [...fileDescriptions];
                          temp.splice(index, 1);
                          setFileDescriptions(temp);
                          files.current.splice(index, 1);
                        }}
                      >
                        <X className="mt-0.5" size={20} strokeWidth={1.2} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={cn(
                  'grid w-full max-w-xs cursor-pointer items-center rounded-[0.625rem] bg-white p-5 transition hover:-translate-y-0.5 hover:bg-neutral-100',
                  isDragActive && '-translate-y-0.5 bg-neutral-100',
                )}
                {...getRootProps()}
              >
                <input {...getInputProps()} disabled={loading} />
                <div className="flex flex-col items-center gap-1">
                  <FilePlus strokeWidth={1.2} />
                  {isDragActive ? 'Drop Here' : 'Upload'}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="grid place-items-center rounded-[0.625rem] bg-white p-10">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="flex-shrink-0" strokeWidth={1} />
              Successfully Submitted!
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 text-center">
        {fileDescriptions.length > 5 && (
          <div className="mb-3 text-sm text-red-500">Limit 5 Files</div>
        )}
        {fileDescriptions.length !== 0 && !done && (
          <Button
            variant="secondary"
            className="flex w-full items-center gap-2"
            onClick={async () => {
              setLoading(true);

              try {
                const formData = new FormData();
                for (let file of files.current) {
                  formData.append('files', file);
                }
                if (title !== '') formData.append('title', title);
                formData.append('assignment', assignmentid);
                formData.append('user', pb.authStore.model?.id);

                await pb.collection('submissions').create(formData);
                setDone(true);
              } catch {
                toast.error('An error occured while uploading');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || fileDescriptions.length > 5}
          >
            {loading ? (
              <>
                Uploading...
                <Loader2 size={20} className="animate-spin" />
              </>
            ) : (
              'Submit'
            )}
          </Button>
        )}
      </div>
    </>
  );
}
