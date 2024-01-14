import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // if (
  //   request.nextUrl.pathname.startsWith('/signin') ||
  //   request.nextUrl.pathname.startsWith('/home') ||
  //   request.nextUrl.pathname.includes('/opengraph-image-')
  // ) {
  //   return NextResponse.next();
  // }

  if (request.cookies.get('pb_auth')?.value !== undefined) {
    if (request.nextUrl.pathname === '/')
      return NextResponse.redirect(new URL('/dashboard', request.url));

    return NextResponse.next();
  } else {
    if (request.nextUrl.pathname === '/')
      return NextResponse.rewrite(new URL('/home', request.url));
    return NextResponse.redirect(
      new URL(`/signin/refresh?after=${request.nextUrl.pathname}`, request.url),
    );
  }
}

export const config = {
  matcher: [
    {
      // source: '/((?!api|_next|favicon.ico).*)',
      source: '/studio/:path*',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
