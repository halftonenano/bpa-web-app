import PocketBase from 'pocketbase';
import { TypedPocketBase } from '../types/pocketbase';

// Initialize a pocketbase instance on the client

const pb = new PocketBase(process.env.NEXT_PUBLIC_API_URL) as TypedPocketBase;

pb.authStore.onChange((auth) => {
  document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
});

export { pb };

export function signOut() {
  pb.authStore.clear();
  document.cookie = 'pb_auth=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
}
