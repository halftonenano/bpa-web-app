import { cookies } from 'next/headers';
import PocketBase from 'pocketbase';
import 'server-only';
import { TypedPocketBase } from '../types/pocketbase';

// Initialize a pocketbase instance on the server

function serverPb() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_API_URL) as TypedPocketBase;
  pb.authStore.loadFromCookie(cookies().toString());
  return pb;
}

export { serverPb };
