"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Globe, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import brandConfig from "@/config/brand.config";

const ROLE_OPTIONS = ["buyer", "renter", "investor", "owner", "agent", "hotel_operator"] as const;

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<(typeof ROLE_OPTIONS)[number]>("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchLocale = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.push(`/${nextLocale}/register`);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, preferredLocale: locale }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error === "Email already registered" ? t("errors.emailExists") : data.error || t("errors.generic"));
        setLoading(false);
        return;
      }

      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch {
      setError(t("errors.generic"));
      setLoading(false);
    }
  }

  return (
    <main data-auth-page className="relative min-h-screen overflow-hidden bg-[#102019]">
      <Image
        src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=90"
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
        className="object-cover object-center"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/45 to-[#102019]/75" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col">
        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-black/40 px-4 py-2.5 shadow-[0_10px_28px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:bg-black/50" aria-label={locale === "ar" ? brandConfig.brandNameAr : brandConfig.brandName}>
            <span aria-hidden="true" className="h-10 w-10 shrink-0 bg-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]" style={{ maskImage: `url(${brandConfig.logo.mark})`, WebkitMaskImage: `url(${brandConfig.logo.mark})`, maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center", maskSize: "contain", WebkitMaskSize: "contain" }} />
            <span className="text-xl font-semibold tracking-tight text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.75)]">
              {locale === "ar" ? brandConfig.brandNameAr : brandConfig.brandName}
            </span>
          </Link>
          <button
            type="button"
            onClick={switchLocale}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-primary/30 hover:bg-primary/5"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            {locale === "en" ? "العربية" : "English"}
          </button>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 pb-10 pt-28 sm:px-8 lg:px-12">
          <section className="flex w-full items-center justify-center py-2 sm:px-0">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="w-full max-w-md rounded-3xl border border-white/35 bg-white/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8"
            >
              <div className="mb-8">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ArrowRight className={locale === "ar" ? "h-5 w-5 rotate-180" : "h-5 w-5"} />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">{t("registerTitle")}</h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("registerSubtitle")}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -8 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -8 }}
                      className="overflow-hidden rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">{t("name")}</label>
                  <input id="name" type="text" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10" autoComplete="name" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">{t("email")}</label>
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10" autoComplete="email" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">{t("password")}</label>
                  <div className="relative">
                    <input id="password" type={showPassword ? "text" : "password"} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 w-full rounded-xl border border-input bg-card px-4 pe-12 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">{t("role")}</label>
                  <select id="role" value={role} onChange={(e) => setRole(e.target.value as (typeof ROLE_OPTIONS)[number])} className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10">
                    {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{t(`roles.${r}`)}</option>)}
                  </select>
                </div>

                <Button type="submit" className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/15 transition-transform hover:-translate-y-0.5" disabled={loading}>
                  {loading ? "..." : t("register")}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t("hasAccount")}{" "}
                  <Link href={`/${locale}/login`} className="font-semibold text-primary hover:underline">{t("login")}</Link>
                </p>
              </form>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}