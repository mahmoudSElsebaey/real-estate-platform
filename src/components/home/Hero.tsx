"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale();

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2400&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary-900))]/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <p className="text-[hsl(var(--accent-300))] text-sm md:text-base font-medium tracking-widest uppercase mb-6">
          {t("eyebrow")}
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
          {t("title")}
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("subtitle")}
        </p>

        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-5 h-5 text-white/60 shrink-0" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full bg-transparent text-white placeholder:text-white/50 text-base focus:outline-none py-3"
              />
            </div>
            <Link href={`/${locale}/discover`} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow transition hover:bg-[hsl(var(--primary-600))]">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <Link
            href={`/${locale}/discover?purpose=sale`}
            className="inline-flex items-center justify-center gap-2 h-12 px-8 text-base font-medium rounded-md bg-primary text-primary-foreground shadow hover:bg-[hsl(var(--primary-600))] min-w-[140px] transition-colors"
          >
            {t("ctaBuy")}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
          <Link
            href={`/${locale}/discover?purpose=rent`}
            className="inline-flex items-center justify-center gap-2 h-12 px-8 text-base font-medium rounded-md border border-white/30 text-white hover:bg-white/10 min-w-[140px] transition-colors"
          >
            {t("ctaRent")}
          </Link>
          <Link
            href={`/${locale}/discover?purpose=invest`}
            className="inline-flex items-center justify-center gap-2 h-12 px-8 text-base font-medium rounded-md border border-white/30 text-white hover:bg-white/10 min-w-[140px] transition-colors"
          >
            {t("ctaInvest")}
          </Link>
          <Link
            href={`/${locale}/discover?category=hotel`}
            className="inline-flex items-center justify-center gap-2 h-12 px-8 text-base font-medium rounded-md bg-[hsl(var(--premium))] text-[hsl(42_30%_12%)] shadow hover:opacity-90 min-w-[140px] transition-colors"
          >
            {t("ctaBook")}
          </Link>
        </div>

        <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto">
          {[
            { value: "2,400+", label: t("stats.properties") },
            { value: "48", label: t("stats.locations") },
            { value: "12k+", label: t("stats.investors") },
            { value: "98%", label: t("stats.satisfaction") },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-semibold text-white mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[hsl(var(--background))] to-transparent" />
    </section>
  );
}
