'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { pb } from '@/lib/pocketbase/client';
import { CoursesResponse, PagesResponse } from '@/lib/types/pocketbase';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const [resultsCourse, setResultsCourse] = useState<CoursesResponse[]>([]);
  const [resultsPage, setResultsPages] = useState<PagesResponse[]>([]);

  const [debouncedTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedTerm !== '') {
      pb.collection('courses')
        .getList(0, 10, {
          filter: `name~"${debouncedTerm}"`,
        })
        .then((result) => {
          setResultsCourse(result.items);
          setSearching(false);
        });
      pb.collection('pages')
        .getList(0, 10, {
          filter: `title~"${debouncedTerm}"`,
        })
        .then((result) => {
          setResultsPages(result.items);
          setSearching(false);
        });
    }
  }, [debouncedTerm]);

  return (
    <div className="mx-auto w-full max-w-3xl p-10">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Search</h1>
        <span className="pointer-events-none text-sm text-neutral-500">
          *search will look through all public and enrolled classes
        </span>
      </div>

      <Input
        className="my-3"
        value={searchTerm}
        placeholder="Search"
        onChange={(e) => {
          setSearchTerm(e.target.value);
          if (e.target.value === '') {
            setSearching(false);
          } else {
            setSearching(true);
          }
        }}
      />

      {searching && <Loader2 className="mx-auto animate-spin" />}

      {searchTerm !== '' && !searching && (
        <>
          <hr className="my-5" />
          <div>
            <h2 className="my-2 text-xl font-bold">Course Results</h2>
            <ul>
              {resultsCourse.map((course) => (
                <li key={course.id}>
                  <Button variant="link" asChild>
                    <Link href={`/courses/${course.id}`}>{course.name}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <hr className="my-5" />
          <div>
            <h2 className="my-2 text-xl font-bold">Page Results</h2>
            <ul>
              {resultsPage.map((page) => (
                <li key={page.id}>
                  <Button variant="link" asChild>
                    <Link href={`/${page.course}/page/${page.id}`}>
                      {page.title}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
