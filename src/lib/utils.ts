import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function simplifyToSlug(string: string) {
  return "";
  // return string
  //   .toLowerCase()
  //   .replace(' ', '-')
  //   .replace(/[^0-9a-zA-Z_-]/g, '');
}
