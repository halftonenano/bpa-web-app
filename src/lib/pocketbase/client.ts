import PocketBase from 'pocketbase';
import { TypedPocketBase } from '../types/pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_API_URL) as TypedPocketBase;

pb.authStore.onChange((auth) => {
  document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
});

export { pb };
