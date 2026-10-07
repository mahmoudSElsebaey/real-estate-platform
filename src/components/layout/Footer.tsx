"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import brandConfig from "@/config/brand.config";

export function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer bg-[hsl(var(--primary-900))] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="h-9 w-9 text-[hsl(var(--accent-400))]">
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                  <rect x="6" y="18" width="8" height="16" rx="1" fill="currentColor" />
                  <rect x="16" y="12" width="8" height="22" rx="1" fill="currentColor" />
                  <rect x="26" y="16" width="8" height="18" rx="1" fill="currentColor" />
                  <path d="M4 18 L20 6 L36 18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="22" r="2.5" fill="currentColor" opacity="0.9" />
                </svg>
              </div>
              <span className="text-xl font-semibold tracking-tight">{locale === "ar" ? brandConfig.brandNameAr : brandConfig.brandName}</span>
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/70">{t("tagline")}</p>
            <div className="flex gap-4">
              {Object.entries(brandConfig.social).filter(([, url]) => Boolean(url)).map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-sm capitalize text-white/60 transition-colors hover:text-[hsl(var(--accent-400))]">{key}</a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2"><h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">{t("discover")}</h3><ul className="space-y-3 text-sm text-white/70"><li><Link href={`/${locale}/discover?purpose=sale`} className="hover:text-white">{t("buy")}</Link></li><li><Link href={`/${locale}/discover?purpose=rent`} className="hover:text-white">{t("rent")}</Link></li><li><Link href={`/${locale}/discover?purpose=invest`} className="hover:text-white">{t("invest")}</Link></li><li><Link href={`/${locale}/discover`} className="hover:text-white">{t("hotels")}</Link></li></ul></div>
          <div className="lg:col-span-2"><h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">{t("company")}</h3><ul className="space-y-3 text-sm text-white/70"><li><Link href={`/${locale}/about`} className="hover:text-white">{t("about")}</Link></li><li><Link href={`/${locale}/contact`} className="hover:text-white">{t("contact")}</Link></li><li><Link href={`/${locale}/careers`} className="hover:text-white">{t("careers")}</Link></li></ul></div>
          <div className="lg:col-span-2"><h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">{t("support")}</h3><ul className="space-y-3 text-sm text-white/70"><li><Link href={`/${locale}/help`} className="hover:text-white">{t("help")}</Link></li><li><Link href={`/${locale}/user-guide`} className="hover:text-white">{t("userGuide")}</Link></li><li><Link href={`/${locale}/privacy`} className="hover:text-white">{t("privacy")}</Link></li><li><Link href={`/${locale}/terms`} className="hover:text-white">{t("terms")}</Link></li></ul></div>
          <div className="lg:col-span-2"><h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">{t("newsletter")}</h3><form className="space-y-3" onSubmit={(e) => e.preventDefault()}><input type="email" placeholder={t("newsletterPlaceholder")} className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-400))]" /><button type="submit" className="w-full rounded-md bg-[hsl(var(--accent-500))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-900))] transition-colors hover:bg-[hsl(var(--accent-400))]">{t("subscribe")}</button></form></div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row"><p>© {year} {brandConfig.brandName}. {t("rights")}</p><p className="text-xs">Cairo · Dubai · London</p></div>
      </div>
    </footer>
  );
}