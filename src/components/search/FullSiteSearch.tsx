'use client';

import { pb } from '@/lib/pocketbase/client';
import { CoursesResponse } from '@/lib/types/pocketbase';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function FullSiteSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const [resultsCourse, setResultsCourse] = useState<CoursesResponse[]>([]);

  const [debouncedTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    pb.collection('courses')
      .getList(0, 10, {
        filter: `name~"${debouncedTerm}" || description~"${debouncedTerm}"`,
      })
      .then((result) => setResultsCourse(result.items));
  }, [debouncedTerm]);

  console.log(resultsCourse);

  return <div className=""></div>;
}
