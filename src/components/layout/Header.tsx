"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Globe, Heart, LogOut, Menu, User, X, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import brandConfig from "@/config/brand.config";

export function Header() {
  const t = useTranslations("Nav");
  const tAuth = useTranslations("Auth");
  const tDashboard = useTranslations("Dashboard");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const propertiesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === `/${locale}`;
  // Pages with dark/image hero sections can safely use the immersive transparent header.
  // Content/account pages keep the solid header to avoid contrast issues on light backgrounds.
  const immersivePage =
    isHome ||
    pathname === `/${locale}/discover` ||
    pathname === `/${locale}/about` ||
    pathname === `/${locale}/contact` ||
    pathname === `/${locale}/careers`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/user/me").then((r) => setIsLoggedIn(r.ok)).catch(() => setIsLoggedIn(false));
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false);
      if (propertiesRef.current && !propertiesRef.current.contains(target)) setPropertiesOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); }
    finally {
      setIsLoggedIn(false);
      setProfileOpen(false);
      setMobileOpen(false);
      router.push(`/${locale}`);
      router.refresh();
    }
  };

  const propertyItems = [
    { href: `/${locale}/discover?purpose=sale`, label: t("buy"), description: locale === "ar" ? "منازل وفرص للامتلاك" : "Homes and ownership opportunities" },
    { href: `/${locale}/discover?purpose=rent`, label: t("rent"), description: locale === "ar" ? "إقامات تناسب أسلوب حياتك" : "Spaces that fit your lifestyle" },
    { href: `/${locale}/discover?purpose=invest`, label: t("invest"), description: locale === "ar" ? "فرص بقيمة طويلة الأجل" : "Long-term value opportunities" },
    { href: `/${locale}/discover`, label: t("discover"), description: locale === "ar" ? "استكشف كل العقارات" : "Explore the full collection" },
    { href: isLoggedIn ? `/${locale}/listings/new` : `/${locale}/register`, label: t("listProperty"), description: locale === "ar" ? "اعرض عقارك على عقاركو" : "List your property on Aqarco" },
  ];

  const profileItems = [
    { href: `/${locale}/dashboard`, label: tDashboard("title") },
    { href: `/${locale}/profile`, label: tDashboard("profile") },
    { href: `/${locale}/bookings`, label: tDashboard("bookings") },
    { href: `/${locale}/favorites`, label: tDashboard("favorites") },
    { href: `/${locale}/inquiries`, label: tDashboard("inquiries") },
    { href: `/${locale}/investments/my`, label: tDashboard("myInterests") },
    { href: `/${locale}/listings`, label: tDashboard("listings") },
  ];

  const transparent = immersivePage && !scrolled;
  const textClass = transparent ? "text-white/90 mix-blend-difference hover:text-white hover:bg-white/10" : "text-foreground/80 hover:text-foreground hover:bg-muted";
  const brandClass = transparent ? "text-white" : "text-[hsl(var(--primary-500))]";

  const closeMenus = () => {
    setMobileOpen(false);
    setPropertiesOpen(false);
  };

  return (
    <header className={cn("site-header inset-x-0 top-0 z-50 transition-all duration-300", transparent ? "fixed bg-transparent" : "sticky border-b border-border/80 bg-background/90 shadow-sm backdrop-blur-xl")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link href={`/${locale}`} className="group flex items-center gap-2.5" onClick={closeMenus}>
            <div className={cn("flex h-9 w-9 items-center justify-center transition-colors", brandClass)}>
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" className="h-full w-full">
                <rect x="6" y="18" width="8" height="16" rx="1" fill="currentColor" />
                <rect x="16" y="12" width="8" height="22" rx="1" fill="currentColor" />
                <rect x="26" y="16" width="8" height="18" rx="1" fill="currentColor" />
                <path d="M4 18 L20 6 L36 18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="22" r="2.5" fill="currentColor" opacity="0.9" />
              </svg>
            </div>
            <span className={cn("hidden text-lg font-semibold tracking-tight transition-colors sm:block", brandClass)}>
              {locale === "ar" ? brandConfig.brandNameAr : brandConfig.shortName}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link href={`/${locale}/contact`} className={cn("rounded-full px-4 py-2.5 text-sm font-medium transition", textClass)}>{locale === "ar" ? "تواصل معنا" : "Contact"}</Link>
            <Link href={`/${locale}/about`} className={cn("rounded-full px-4 py-2.5 text-sm font-medium transition", textClass)}>{locale === "ar" ? "من نحن" : "About us"}</Link>
            <div ref={propertiesRef} className="relative">
              <button type="button" onClick={() => setPropertiesOpen((v) => !v)} className={cn("inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition", textClass)} aria-expanded={propertiesOpen}>
                <Building2 className="h-4 w-4" />
                {locale === "ar" ? "العقارات" : "Properties"}
                <ChevronDown className={cn("h-4 w-4 transition-transform", propertiesOpen && "rotate-180")} />
              </button>
              {propertiesOpen && (
                <div className="absolute left-1/2 top-12 w-[390px] -translate-x-1/2 overflow-hidden rounded-3xl border border-border bg-background p-2 shadow-2xl">
                  <div className="px-4 pb-2 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">{locale === "ar" ? "استكشف عقاركو" : "EXPLORE AQARCO"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {propertyItems.map((item) => (
                      <Link key={item.href} href={item.href} onClick={closeMenus} className="group rounded-2xl p-3.5 transition hover:bg-muted">
                        <span className="block text-sm font-semibold text-foreground group-hover:text-primary">{item.label}</span>
                        <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{item.description}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href={`/${locale}/careers`} className={cn("rounded-full px-4 py-2.5 text-sm font-medium transition", textClass)}>{locale === "ar" ? "الوظائف" : "Careers"}</Link>
          </nav>

          <div className="flex items-center gap-1.5">
            <button onClick={switchLocale} className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm transition", textClass)} aria-label="Switch language">
              <Globe className="h-4 w-4" /><span className="hidden sm:inline">{locale === "en" ? "العربية" : "English"}</span>
            </button>
            <Link href={`/${locale}/favorites`} className={cn("rounded-full p-2 transition", textClass)} aria-label={t("favorites")}><Heart className="h-5 w-5" /></Link>

            {isLoggedIn ? (
              <div ref={profileRef} className="relative">
                <button type="button" onClick={() => setProfileOpen((v) => !v)} className={cn("flex h-10 w-10 items-center justify-center rounded-full transition", textClass)} aria-label={t("account")} aria-expanded={profileOpen}>
                  <User className="h-5 w-5" />
                </button>
                {profileOpen && (
                  <div className="absolute end-0 top-12 z-[60] w-60 overflow-hidden rounded-2xl border border-border bg-background p-2 shadow-xl">
                    <div className="border-b border-border px-3 py-2.5"><p className="text-xs font-medium text-muted-foreground">{t("account")}</p></div>
                    <div className="py-1">{profileItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setProfileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted">{item.label}</Link>)}</div>
                    <div className="border-t border-border pt-1"><button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"><LogOut className="h-4 w-4" />{tAuth("logout")}</button></div>
                  </div>
                )}
              </div>
            ) : (
              <Link href={`/${locale}/login`} className={cn("hidden rounded-full px-3 py-2 text-xs font-medium transition sm:inline-flex", textClass)}>{tAuth("login")}</Link>
            )}
            <button onClick={() => setMobileOpen((v) => !v)} className={cn("rounded-full p-2 lg:hidden", transparent ? "text-white mix-blend-difference" : "text-foreground")} aria-label="Toggle menu">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-b border-border bg-background shadow-xl lg:hidden">
          <nav className="space-y-1 px-4 py-4">
            <p className="px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">{locale === "ar" ? "العقارات" : "PROPERTIES"}</p>
            {propertyItems.map((item) => <Link key={item.href} href={item.href} onClick={closeMenus} className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground transition hover:bg-muted">{item.label}</Link>)}
            <div className="my-2 border-t border-border" />
            <Link href={`/${locale}/about`} onClick={closeMenus} className="block rounded-2xl px-4 py-3 text-base font-medium">{locale === "ar" ? "من نحن" : "About us"}</Link>
            <Link href={`/${locale}/careers`} onClick={closeMenus} className="block rounded-2xl px-4 py-3 text-base font-medium">{locale === "ar" ? "الوظائف" : "Careers"}</Link>
            <Link href={`/${locale}/contact`} onClick={closeMenus} className="block rounded-2xl px-4 py-3 text-base font-medium">{locale === "ar" ? "تواصل معنا" : "Contact"}</Link>
            {!isLoggedIn && <Link href={`/${locale}/login`} onClick={closeMenus} className="block rounded-2xl px-4 py-3 text-base font-medium text-primary">{tAuth("login")}</Link>}
            {isLoggedIn && <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-start font-medium text-red-600"><LogOut className="h-4 w-4" />{tAuth("logout")}</button>}
          </nav>
        </div>
      )}
    </header>
  );
}
