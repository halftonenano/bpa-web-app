import { initAdminPb } from '@/lib/pocketbase/admin';
import { serverPb } from '@/lib/pocketbase/server';
import {
  CoursesRecord,
  EnrollmentsRecord,
  TeachersRecord,
} from '@/lib/types/pocketbase';

export const runtime = 'edge';

export async function POST(request: Request) {
  const pb = serverPb();
  if (!pb.authStore.model || !pb.authStore.model.id)
    return Response.json({ error: 'Not authenticated' }, { status: 403 });
  const adminPb = await initAdminPb();

  const course = await adminPb.collection('courses').create({
    name: 'Untitled Course',
    description: 'Course description',
    color: '#4287f5',
    icon: 'U',
    joinCode: Math.random().toString(36).substr(2, 5).toUpperCase(),
  } satisfies CoursesRecord);

  await adminPb.collection('teachers').create({
    user: pb.authStore.model.id,
    course: course.id,
  } satisfies TeachersRecord);
  await adminPb.collection('enrollments').create({
    user: pb.authStore.model.id,
    course: course.id,
  } satisfies EnrollmentsRecord);

  return Response.json(course);
}
