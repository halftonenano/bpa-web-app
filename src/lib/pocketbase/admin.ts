import PocketBase from 'pocketbase';
import 'server-only';
import { TypedPocketBase } from '../types/pocketbase';

// Instead of having to create a new session with admin on every request with the server admin pb
// this initializes the admin client by fetching the admin token cookie from the secrets table with the internal access key
// See src/app/internal/refresh-cookie/route.ts

export async function initAdminPb() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_API_URL) as TypedPocketBase;

  const response: { value: string; code?: number } = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/collections/secrets/records/___admin-cookie`,
      { headers: { 'X-Internal-Key': process.env.INTERNAL_KEY } },
    )
  ).json();

  if (response.code) throw new Error();

  pb.authStore.loadFromCookie(response.value);

  return pb;
}
