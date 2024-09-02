import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName } from '../app/i18n/settings'; // Adjust the path if necessary

acceptLanguage.languages(languages);

export function middleware(req) {
  const { pathname } = req.nextUrl;
  let lng;

  // Step 1: Determine the language from the cookie
  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName).value);
  }

  // Step 2: If no language is set in the cookie, check the Accept-Language header
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  }

  // Step 3: If no language is determined, use the fallback language
  if (!lng) {
    lng = fallbackLng;
  }

  // Step 4: Check if the current path already starts with a valid language
  if (
    !languages.some((loc) => pathname.startsWith(`/${loc}`)) &&
    !pathname.startsWith('/_next')
  ) {
    // Step 5: Redirect the user to the correct language path
    return NextResponse.redirect(new URL(`/${lng}${pathname}`, req.url));
  }

  // Step 6: Set the language cookie if not already set
  const response = NextResponse.next();
  if (!req.cookies.has(cookieName)) {
    response.cookies.set(cookieName, lng);
  }

  return response;
}

