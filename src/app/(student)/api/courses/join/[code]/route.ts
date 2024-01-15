import { initAdminPb } from '@/lib/pocketbase/admin';
import { serverPb } from '@/lib/pocketbase/server';
import { EnrollmentsRecord } from '@/lib/types/pocketbase';

export const runtime = 'edge';

export async function POST(
  request: Request,
  { params: { code } }: { params: { code: string } },
) {
  if (!/^[0-9A-z]+$/.test(code))
    return Response.json({ error: 'invalid code' }, { status: 400 });

  const pb = serverPb();
  if (!pb.authStore.model || !pb.authStore.model.id)
    return Response.json({ error: 'Not authenticated' }, { status: 403 });
  const adminPb = await initAdminPb();

  const course = await adminPb
    .collection('courses')
    .getFirstListItem(`joinCode="${code}"`);

  await adminPb.collection('enrollments').create({
    user: pb.authStore.model.id,
    course: course.id,
  } satisfies EnrollmentsRecord);

  return Response.json(course);
}
