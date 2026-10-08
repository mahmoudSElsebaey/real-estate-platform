import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** Paths (without locale prefix) that require an authenticated session cookie */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/profile",
  "/listings",
  "/favorites",
  "/compare",
  "/inquiries",
  "/inbox",
  "/bookings",
  "/investments/my",
  "/investments/inbox",
  "/admin",
];

function stripLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  const maybeLocale = segments[0];
  if (routing.locales.includes(maybeLocale as "en" | "ar")) {
    const rest = "/" + segments.slice(1).join("/");
    return rest === "/" ? "/" : rest.replace(/\/$/, "") || "/";
  }
  return pathname;
}

function isProtectedPath(pathWithoutLocale: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) =>
      pathWithoutLocale === prefix ||
      pathWithoutLocale.startsWith(prefix + "/")
  );
}

function hasSessionCookie(req: NextRequest): boolean {
  return Boolean(req.cookies.get("aether_session")?.value);
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const pathWithoutLocale = stripLocale(pathname);

  if (isProtectedPath(pathWithoutLocale) && !hasSessionCookie(req)) {
    const segments = pathname.split("/").filter(Boolean);
    const locale =
      segments[0] && routing.locales.includes(segments[0] as "en" | "ar")
        ? segments[0]
        : routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
