// authMiddleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Configuration for roles and access redirection
export async function authMiddleware(req) {
  // Fetch the authentication token
  const token = await getToken({
    req,
    secret: 'ND00PWerflfLsSkG7Qn/LlWgmThyzAxEA4IjFIEvyhM=',
  });

  // Role-based authentication and redirection
  if (token) {
    const { role } = token;
    const isLoginPage = req.nextUrl.pathname.includes('/auth/login');

    // Owner Role: Redirect owners away from the login page to the Dashboard
    if (role === 'owner' && isLoginPage) {
      return NextResponse.redirect(new URL(`/Dashboard`, req.url));
    }

    // Normal User Role: Redirect normal users appropriately
    if (role === 'normal') {
      if (isLoginPage) {
        return NextResponse.redirect(new URL(`/`, req.url)); // Redirect to home if trying to access login
      }
      return NextResponse.next(); // Allow normal users to proceed
    }
  } else if (req.nextUrl.pathname.includes(`/Dashboard`)) {
    // Redirect unauthenticated users trying to access the Dashboard to login
    return NextResponse.redirect(new URL(`/auth/login`, req.url));
  }

  // Default response if no special condition matches
  return NextResponse.next();
}
