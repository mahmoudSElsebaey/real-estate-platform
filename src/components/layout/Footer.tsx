"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import brandConfig from "@/config/brand.config";

export function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[hsl(var(--primary-900))] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 text-[hsl(var(--accent-400))]">
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                  <rect x="6" y="18" width="8" height="16" rx="1" fill="currentColor" />
                  <rect x="16" y="12" width="8" height="22" rx="1" fill="currentColor" />
                  <rect x="26" y="16" width="8" height="18" rx="1" fill="currentColor" />
                  <path d="M4 18 L20 6 L36 18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="22" r="2.5" fill="currentColor" opacity="0.9" />
                </svg>
              </div>
              <span className="font-semibold text-xl tracking-tight">{brandConfig.brandName}</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs mb-6">{t("tagline")}</p>
            <div className="flex gap-4">
              {Object.entries(brandConfig.social).map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[hsl(var(--accent-400))] transition-colors capitalize text-sm">{key}</a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-sm tracking-wide uppercase text-white/90 mb-4">{t("discover")}</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href={`/${locale}/discover?purpose=sale`} className="hover:text-white transition-colors">{t("buy")}</Link></li>
              <li><Link href={`/${locale}/discover?purpose=rent`} className="hover:text-white transition-colors">{t("rent")}</Link></li>
              <li><Link href={`/${locale}/discover?purpose=invest`} className="hover:text-white transition-colors">{t("invest")}</Link></li>
              <li><Link href={`/${locale}/discover`} className="hover:text-white transition-colors">{t("hotels")}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-sm tracking-wide uppercase text-white/90 mb-4">{t("company")}</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href={`/${locale}/about`} className="hover:text-white transition-colors">{t("about")}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-white transition-colors">{t("contact")}</Link></li>
              <li><Link href={`/${locale}/careers`} className="hover:text-white transition-colors">{t("careers")}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-sm tracking-wide uppercase text-white/90 mb-4">{t("support")}</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href={`/${locale}/help`} className="hover:text-white transition-colors">{t("help")}</Link></li>
              <li><Link href={`/${locale}/user-guide`} className="hover:text-white transition-colors">{t("userGuide")}</Link></li>
              <li><Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">{t("privacy")}</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:text-white transition-colors">{t("terms")}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-sm tracking-wide uppercase text-white/90 mb-4">{t("newsletter")}</h3>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={t("newsletterPlaceholder")} className="w-full px-3 py-2.5 rounded-md bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-400))]" />
              <button type="submit" className="w-full px-4 py-2.5 rounded-md bg-[hsl(var(--accent-500))] text-[hsl(var(--primary-900))] text-sm font-medium hover:bg-[hsl(var(--accent-400))] transition-colors">{t("subscribe")}</button>
            </form>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>© {year} {brandConfig.brandName}. {t("rights")}</p>
          <p className="text-xs">Cairo · Dubai · London</p>
        </div>
      </div>
    </footer>
  );
}
