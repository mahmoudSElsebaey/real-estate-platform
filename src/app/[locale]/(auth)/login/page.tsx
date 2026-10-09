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

const DEMO_ACCOUNTS = [
  { role: "admin", email: "admin@aqarco.demo" },
  { role: "owner", email: "owner@aqarco.demo" },
  { role: "agent", email: "agent@aqarco.demo" },
  { role: "investor", email: "investor@aqarco.demo" },
  { role: "buyer", email: "buyer@aqarco.demo" },
  { role: "renter", email: "renter@aqarco.demo" },
  { role: "hotel_operator", email: "hotel@aqarco.demo" },
] as const;

const DEMO_PASSWORD = "Demo@12345";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchLocale = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.push(`/${nextLocale}/login`);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("errors.generic"));
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

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    setError("");
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
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2.5 rounded-2xl px-4 py-2.5 transition"
            aria-label={locale === "ar" ? brandConfig.brandNameAr : brandConfig.brandName}
          >
            <span aria-hidden="true" className="h-10 w-10 shrink-0 bg-white drop-shadow-[0_0_1px_rgba(255,255,255,0.95)]" style={{ maskImage: `url(${brandConfig.logo.mark})`, WebkitMaskImage: `url(${brandConfig.logo.mark})`, maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center", maskSize: "contain", WebkitMaskSize: "contain" }} />
            <span className="text-xl font-semibold tracking-tight text-white [text-shadow:0_0_1px_rgba(255,255,255,0.95)]">
              {locale === "ar" ? brandConfig.brandNameAr : brandConfig.brandName}
            </span>
          </Link>

          <button
            type="button"
            onClick={switchLocale}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-primary/30 hover:bg-primary/5 hover:text-white"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            {locale === "en" ? "العربية" : "English"}
          </button>
        </header>

        <div className="grid flex-1 items-center justify-center gap-8 px-5 pb-10 pt-28 sm:px-8 lg:grid-cols-2 lg:gap-10 lg:px-12">
          <motion.section
            initial={{ opacity: 0, x: locale === "ar" ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative hidden min-h-[620px] flex-col justify-end overflow-hidden text-white lg:flex"
          >
            <div className="relative z-10 flex h-full -translate-y-[200px] flex-col justify-center p-10 pb-16 text-white xl:p-14 xl:pb-20">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-md"
              >
                <Sparkles className="h-4 w-4" />
                <span>{locale === "ar" ? "مرحبًا بعودتك" : "Welcome back"}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="max-w-xl text-4xl font-semibold leading-tight tracking-tight xl:text-5xl"
              >
                {locale === "ar" ? brandConfig.tagline.ar : brandConfig.tagline.en}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-5 max-w-lg text-base leading-7 text-white/75"
              >
                {locale === "ar" ? brandConfig.description.ar : brandConfig.description.en}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-8 flex items-center gap-3 text-sm text-white/80"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span>{locale === "ar" ? "تجربة آمنة وبسيطة من البداية" : "A secure, simple experience from the start"}</span>
              </motion.div>
            </div>
          </motion.section>
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
                <h1 className="text-3xl font-semibold tracking-tight">{t("loginTitle")}</h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("loginSubtitle")}</p>
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
                  <label htmlFor="email" className="text-sm font-medium">{t("email")}</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">{t("password")}</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 w-full rounded-xl border border-input bg-card px-4 pe-12 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/15 transition-transform hover:-translate-y-0.5"
                  disabled={loading}
                >
                  {loading ? "..." : t("login")}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t("noAccount")}{" "}
                  <Link href={`/${locale}/register`} className="font-semibold text-primary hover:underline">
                    {t("register")}
                  </Link>
                </p>
              </form>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="mt-8 rounded-2xl border border-border bg-card/70 p-4 shadow-sm"
              >
                <p className="text-sm font-semibold">{t("demoTitle")}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{t("demoSubtitle")}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => fillDemo(acc.email)}
                      className="rounded-xl border border-border bg-background px-2.5 py-2 text-xs font-medium transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5"
                    >
                      {t(`roles.${acc.role}` as any)}
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-[11px] text-muted-foreground">{t("demoCredentials")}</p>
              </motion.div>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}
