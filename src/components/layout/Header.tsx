"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Heart, User, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import brandConfig from "@/config/brand.config";

export function Header() {
  const t = useTranslations("Nav");
  const tAuth = useTranslations("Auth");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/user/me").then((r) => setIsLoggedIn(r.ok)).catch(() => setIsLoggedIn(false));
  }, [pathname]);

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const navItems = [
    { href: `/${locale}/discover?purpose=sale`, label: t("buy") },
    { href: `/${locale}/discover?purpose=rent`, label: t("rent") },
    { href: `/${locale}/discover?purpose=invest`, label: t("invest") },
    { href: `/${locale}/discover`, label: t("discover") },
  ];

  return (
    <header className={cn("fixed top-0 inset-x-0 z-50 transition-all duration-300", scrolled ? "bg-[hsl(var(--background))]/95 backdrop-blur-md border-b border-[hsl(var(--border))] shadow-sm" : "bg-transparent")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
            <div className={cn("w-9 h-9 flex items-center justify-center transition-colors", scrolled ? "text-primary" : "text-white")}>
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" className="w-full h-full">
                <rect x="6" y="18" width="8" height="16" rx="1" fill="currentColor" />
                <rect x="16" y="12" width="8" height="22" rx="1" fill="currentColor" />
                <rect x="26" y="16" width="8" height="18" rx="1" fill="currentColor" />
                <path d="M4 18 L20 6 L36 18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="22" r="2.5" fill="currentColor" opacity="0.9" />
              </svg>
            </div>
            <span className={cn("font-semibold text-lg tracking-tight hidden sm:block transition-colors", scrolled ? "text-foreground" : "text-white")}>{brandConfig.shortName}</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors", scrolled ? "text-foreground/80 hover:text-foreground hover:bg-muted" : "text-white/90 hover:text-white hover:bg-white/10")}>{item.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={switchLocale} className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm transition-colors", scrolled ? "text-foreground/80 hover:bg-muted" : "text-white/90 hover:bg-white/10")} aria-label="Switch language">
              <Globe className="w-4 h-4" /><span className="hidden sm:inline">{locale === "en" ? "العربية" : "English"}</span>
            </button>
            <Link href={`/${locale}/favorites`} className={cn("p-2 rounded-md transition-colors", scrolled ? "text-foreground/80 hover:bg-muted" : "text-white/90 hover:bg-white/10")} aria-label={t("favorites")}><Heart className="w-5 h-5" /></Link>
            {isLoggedIn ? (
              <Link href={`/${locale}/dashboard`} className={cn("p-2 rounded-md transition-colors hidden sm:flex", scrolled ? "text-foreground/80 hover:bg-muted" : "text-white/90 hover:bg-white/10")} aria-label={t("account")}><User className="w-5 h-5" /></Link>
            ) : (
              <Link href={`/${locale}/login`} className={cn("hidden sm:inline-flex items-center justify-center h-9 px-3 text-xs font-medium rounded-md transition-colors", scrolled ? "text-foreground/80 hover:bg-muted" : "text-white/90 hover:bg-white/10")}>{tAuth("login")}</Link>
            )}
            <Link href={isLoggedIn ? `/${locale}/listings/new` : `/${locale}/register`} className={cn("hidden md:inline-flex items-center justify-center h-9 px-3 text-xs font-medium rounded-md transition-colors", scrolled ? "bg-primary text-primary-foreground shadow hover:bg-[hsl(var(--primary-600))]" : "border border-white/30 text-white hover:bg-white/10")}>{t("listProperty")}</Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className={cn("lg:hidden p-2 rounded-md", scrolled ? "text-foreground" : "text-white")} aria-label="Toggle menu">{mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-[hsl(var(--background))] border-b border-[hsl(var(--border))]">
          <nav className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-base font-medium text-foreground rounded-md hover:bg-muted">{item.label}</Link>
            ))}
            <Link href={isLoggedIn ? `/${locale}/listings/new` : `/${locale}/register`} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-base font-medium text-primary rounded-md hover:bg-muted">{t("listProperty")}</Link>
            {!isLoggedIn && <Link href={`/${locale}/login`} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-base font-medium text-foreground rounded-md hover:bg-muted">{tAuth("login")}</Link>}
          </nav>
        </div>
      )}
    </header>
  );
}
