import PocketBase from 'pocketbase';

export const runtime = 'edge';

export async function GET(request: Request) {
  if (request.headers.get('X-Internal-Key') !== process.env.INTERNAL_KEY) {
    return new Response('invalid key', { status: 401 });
  }

  const pb = new PocketBase(process.env.NEXT_PUBLIC_API_URL);

  await pb.admins.authWithPassword(
    process.env.API_ADMIN_EMAIL,
    process.env.API_ADMIN_PASSWORD
  );

  const pbAdminCookie = pb.authStore.exportToCookie();

  const response: { value: string; code?: number; message?: string } = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/collections/secrets/records/___admin-cookie`,
      {
        method: 'PATCH',
        headers: {
          'X-Internal-Key': process.env.INTERNAL_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: pbAdminCookie }),
      }
    )
  ).json();

  return new Response(response.message || 'success', {
    status: response.code || 201,
  });
}
