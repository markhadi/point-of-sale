import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const userRole = token.role as string | undefined;
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/cashier/dashboard', request.url));
  }

  if (pathname.startsWith('/cashier') && userRole !== 'CASHIER') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/cashier/:path*'],
};
