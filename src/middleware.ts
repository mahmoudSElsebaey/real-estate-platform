import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

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
] as const;

function getLocaleAndPath(pathname: string): { locale: string; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first === "en" || first === "ar") {
    const path =
      segments.length > 1 ? "/" + segments.slice(1).join("/") : "/";
    return { locale: first, path };
  }
  return { locale: routing.defaultLocale, path: pathname || "/" };
}

function isProtected(path: string): boolean {
  for (const prefix of PROTECTED_PREFIXES) {
    if (path === prefix || path.startsWith(prefix + "/")) return true;
  }
  return false;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const { locale, path } = getLocaleAndPath(pathname);

  if (isProtected(path)) {
    const token = req.cookies.get("aether_session")?.value;
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = `/${locale}/login`;
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
