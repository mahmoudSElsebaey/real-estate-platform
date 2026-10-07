"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
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
    <main className="min-h-[calc(100vh-5rem)] overflow-hidden bg-background">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, x: locale === "ar" ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative hidden min-h-[720px] overflow-hidden lg:block"
        >
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85"
            alt="Luxury modern residence"
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/30 to-black/65" />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14 text-white">
            <Link href={`/${locale}`} className="inline-flex w-fit items-center gap-3">
              <div className="rounded-xl bg-white/95 p-2 shadow-xl backdrop-blur">
                <Image src={brandConfig.logo.mark} alt={brandConfig.shortName} width={38} height={38} />
              </div>
              <span className="text-2xl font-semibold tracking-tight">
                {locale === "ar" ? brandConfig.brandNameAr : brandConfig.brandName}
              </span>
            </Link>

            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-md"
              >
                <Sparkles className="h-4 w-4" />
                <span>{locale === "ar" ? "تجربة عقارية أذكى" : "A smarter real estate experience"}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl"
              >
                {locale === "ar"
                  ? brandConfig.tagline.ar
                  : brandConfig.tagline.en}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-5 max-w-lg text-base leading-7 text-white/75"
              >
                {locale === "ar"
                  ? brandConfig.description.ar
                  : brandConfig.description.en}
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
                <span>
                  {locale === "ar"
                    ? "حسابك وبياناتك في أمان"
                    : "Your account and data are protected"}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <section className="flex items-center justify-center px-5 py-12 sm:px-8 lg:px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="mb-8 lg:hidden">
              <Link href={`/${locale}`} className="inline-flex items-center gap-3">
                <Image src={brandConfig.logo.mark} alt={brandConfig.shortName} width={40} height={40} />
                <span className="text-xl font-semibold">{locale === "ar" ? brandConfig.brandNameAr : brandConfig.brandName}</span>
              </Link>
            </div>

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
                  className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
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
                    className="h-12 w-full rounded-xl border border-input bg-card px-4 pe-12 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
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
                <Link href={`/${locale}/register`} className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline">
                  {t("register")}
                </Link>
              </p>
            </form>

            <div className="my-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Demo</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-sm font-semibold">{t("demoTitle")}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{t("demoSubtitle")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => fillDemo(acc.email)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                  >
                    {t(`roles.${acc.role}` as any)}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">{t("demoCredentials")}</p>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
