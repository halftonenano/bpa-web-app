import { serverPb } from '@/lib/pocketbase/server';

export default async function Page({
  params: { courseid },
}: {
  params: { courseid: string[] };
}) {
  const courses = await serverPb().collection('courses').getOne(courseid[0]);

  return <>{courseid[0]}</>;
}
