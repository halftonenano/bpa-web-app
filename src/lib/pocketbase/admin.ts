import PocketBase from 'pocketbase';
import 'server-only';
import { TypedPocketBase } from '../types/pocketbase';

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
