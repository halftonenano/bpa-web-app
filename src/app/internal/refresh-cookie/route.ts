import PocketBase from 'pocketbase';

export const runtime = 'edge';

// Instead of having to create a new session with admin on every request with the server admin pb
// this route can reauthenticate via a cron job and save the admin token cookie in the secrets table with the internal access key
// See src/lib/pocketbase/admin.ts

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
