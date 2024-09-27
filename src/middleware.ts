import { auth } from "@/auth";

const loginPath = "/auth/login";
const profilePath = "/auth/profile";
const landingPath = "/";

export default auth((request) => {
  // Allow all requests to the landing page
  if (request.nextUrl.pathname === landingPath) {
    return undefined;
  }

  // New user
  if (!request.auth && request.nextUrl.pathname !== loginPath) {
    return Response.redirect(new URL(loginPath, request.nextUrl.origin));
  }
  const hasProfileData = request.auth?.user.hasProfile;

  // User has no profile data
  if (
    hasProfileData !== undefined &&
    !hasProfileData &&
    request.nextUrl.pathname !== profilePath
  ) {
    return Response.redirect(new URL(profilePath, request.nextUrl.origin));
  }

  return undefined;
});
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
