"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import brandConfig from "@/config/brand.config";

export function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const year = new Date().getFullYear();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/user/me").then((r) => setIsLoggedIn(r.ok)).catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <footer className="site-footer bg-[hsl(var(--primary-900))] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="mb-6 flex items-center gap-3 sm:gap-4">
              <div className="h-[56px] w-[56px] shrink-0 text-[hsl(var(--accent-400))] drop-shadow-[0_5px_12px_rgba(0,0,0,0.28)] md:h-[84px] md:w-[84px]">
                <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                  <rect x="6" y="18" width="8" height="16" rx="1" fill="currentColor" />
                  <rect x="16" y="12" width="8" height="22" rx="1" fill="currentColor" />
                  <rect x="26" y="16" width="8" height="18" rx="1" fill="currentColor" />
                  <path d="M4 18 L20 6 L36 18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="22" r="2.5" fill="currentColor" opacity="0.9" />
                </svg>
              </div>
              <span className="text-3xl font-semibold leading-none tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] md:text-[48px]">
                {locale === "ar" ? brandConfig.brandNameAr : brandConfig.brandName}
              </span>
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/70">{t("tagline")}</p>
            <div className="flex flex-wrap items-center gap-3" aria-label={locale === "ar" ? "حسابات التواصل الاجتماعي" : "Social media links"}>
              {Object.entries(brandConfig.social).filter(([, url]) => Boolean(url)).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key === "twitter" ? "X" : key.charAt(0).toUpperCase() + key.slice(1)}
                  title={key === "twitter" ? "X" : key.charAt(0).toUpperCase() + key.slice(1)}
                  className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/70 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--accent-400))]/60 hover:bg-[hsl(var(--accent-400))] hover:text-[hsl(var(--primary-900))] hover:shadow-lg hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-400))]"
                >
                  {key === "instagram" && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.7" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  )}
                  {key === "twitter" && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.47L5.5 22H2.36l7.25-8.29L1.8 2h6.4l4.43 6.78L18.9 2Zm-1.1 17.9h1.73L7.27 3.98H5.42L17.8 19.9Z" />
                    </svg>
                  )}
                  {key === "linkedin" && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <path d="M5.2 3.25a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4ZM3.3 9h3.8v11.7H3.3V9Zm6.1 0H13v1.6h.05A4.1 4.1 0 0 1 16.7 8.7c3.9 0 4.6 2.55 4.6 5.85v6.15h-3.8v-5.45c0-1.3-.03-2.97-1.8-2.97-1.8 0-2.08 1.4-2.08 2.87v5.55H9.4V9Z" />
                    </svg>
                  )}
                  {key === "facebook" && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <path d="M13.7 21v-8.2h2.76l.42-3.2H13.7V7.56c0-.93.26-1.56 1.6-1.56H17V3.14C16.7 3.1 15.7 3 14.5 3c-2.5 0-4.2 1.53-4.2 4.34V9.6H7.5v3.2h2.8V21h3.4Z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2"><h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">{t("discover")}</h3><ul className="space-y-3 text-sm text-white/70"><li><Link href={`/${locale}/discover?purpose=sale`} className="hover:text-white">{t("buy")}</Link></li><li><Link href={`/${locale}/discover?purpose=rent`} className="hover:text-white">{t("rent")}</Link></li><li><Link href={`/${locale}/discover?purpose=invest`} className="hover:text-white">{t("invest")}</Link></li><li><Link href={`/${locale}/discover`} className="hover:text-white">{t("hotels")}</Link></li></ul></div>
          <div className="lg:col-span-2"><h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">{t("company")}</h3><ul className="space-y-3 text-sm text-white/70"><li><Link href={`/${locale}/about`} className="hover:text-white">{t("about")}</Link></li><li><Link href={`/${locale}/contact`} className="hover:text-white">{t("contact")}</Link></li><li><Link href={`/${locale}/careers`} className="hover:text-white">{t("careers")}</Link></li></ul></div>
          <div className="lg:col-span-2"><h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">{t("support")}</h3><ul className="space-y-3 text-sm text-white/70"><li><Link href={`/${locale}/help`} className="hover:text-white">{t("help")}</Link></li><li><Link href={`/${locale}/user-guide`} className="hover:text-white">{t("userGuide")}</Link></li><li><Link href={`/${locale}/privacy`} className="hover:text-white">{t("privacy")}</Link></li><li><Link href={`/${locale}/terms`} className="hover:text-white">{t("terms")}</Link></li></ul></div>
          <div className="lg:col-span-2"><h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">{t("newsletter")}</h3><form className="space-y-3" onSubmit={(e) => e.preventDefault()}><input type="email" placeholder={t("newsletterPlaceholder")} className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-400))]" /><button type="submit" className="w-full rounded-md bg-[hsl(var(--accent-500))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-900))] transition-colors hover:bg-[hsl(var(--accent-400))]">{t("subscribe")}</button></form></div>
        </div>
        <div className="mt-14 flex justify-center">
          <div className="group inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent-400))]/25 bg-white/[0.04] px-4 py-2.5 text-center shadow-lg shadow-black/10 transition-all duration-300 hover:border-[hsl(var(--accent-400))]/50 hover:bg-white/[0.07]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[hsl(var(--accent-400))] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
              <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
            </svg>
            <span className="text-xs font-medium tracking-wide text-white/75 sm:text-sm">{t("craftedBy")}</span>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row"><p>© {year} {brandConfig.brandName}. {t("rights")}</p><p className="text-xs">Cairo · Dubai · London</p></div>
      </div>
    </footer>
  );
}