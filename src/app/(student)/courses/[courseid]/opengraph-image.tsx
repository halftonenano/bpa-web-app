import { serverPb } from '@/lib/pocketbase/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'About Acme';
export const size = {
  width: 1000,
  height: 500,
};
export const contentType = 'image/png';

export default async function Image({
  params: { courseid },
}: {
  params: { courseid: string };
}) {
  const pb = serverPb();
  const course = await pb.collection('courses').getOne(courseid);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {course.name}
      </div>
    ),
    {
      ...size,
    },
  );
}
