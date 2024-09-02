import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Language Detection

  // Authentication and Role Check
  const token = await getToken({ req, secret: 'ND00PWerflfLsSkG7Qn/LlWgmThyzAxEA4IjFIEvyhM=' });

  const isProtectedRoute = ['/Dashboard', '/settings'].some(route => pathname.startsWith(route));
  const isLoginPage = pathname.includes('/auth/login');

  if (token) {
    const { role } = token;

    // Role-Based Redirection
    if (role === 'normal') {
      if (isLoginPage) {
        return NextResponse.redirect(new URL(`/`, req.url));
      }
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL(`/`, req.url));
      }
    }   else if (role === 'owner' && isLoginPage) {
      return NextResponse.redirect(new URL(`/Dashboard`, req.url));
    }
  } else if (isProtectedRoute) {
    return NextResponse.redirect(new URL(`/auth/login`, req.url));
  }


  // Set language cookie if not set
  const response = NextResponse.next();


  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'],
};
