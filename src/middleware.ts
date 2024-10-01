import { auth } from "@/auth";
import { NextResponse } from "next/server";

const loginPath = "/auth/login";
const profilePath = "/auth/profile";
const landingPath = "/";

export default auth((request) => {
  const { pathname, origin } = request.nextUrl;

  // Allow all requests to the landing page
  if (pathname === landingPath) {
    return undefined;
  }

  // New user
  if (!request.auth && pathname !== loginPath) {
    return Response.redirect(new URL(loginPath, origin));
  }
  const hasProfileData = request.auth?.user.hasProfile;

  // User has no profile data
  if (
    hasProfileData !== undefined &&
    !hasProfileData &&
    pathname !== profilePath
  ) {
    return Response.redirect(new URL(profilePath, origin));
  }

  // TODO: Refactor to a cookieless single route approach (mild security issue)
  if (pathname === "/play/hard") {
    const accessAllowedCookie = request.cookies.get("accessHard");
    if (accessAllowedCookie === undefined) {
      // Redirect to /play if the cookie is not set
      return Response.redirect(new URL("/play", origin));
    }

    if (accessAllowedCookie.value === "true") {
      const response = NextResponse.next();
      response.cookies.delete("accessHard");
      return undefined;
    }
    return Response.redirect(new URL("/play", origin));
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
