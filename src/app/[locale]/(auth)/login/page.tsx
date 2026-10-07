"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import brandConfig from "@/config/brand.config";

const DEMO_ACCOUNTS = [
  { role: "buyer", email: "demo.buyer@aether.test", password: "Demo@12345" },
  { role: "renter", email: "demo.renter@aether.test", password: "Demo@12345" },
  { role: "investor", email: "demo.investor@aether.test", password: "Demo@12345" },
  { role: "owner", email: "demo.owner@aether.test", password: "Demo@12345" },
  { role: "agent", email: "demo.agent@aether.test", password: "Demo@12345" },
  { role: "hotel_operator", email: "demo.hotel@aether.test", password: "Demo@12345" },
  { role: "admin", email: "demo.admin@aether.test", password: "Demo@12345" },
] as const;

export default function LoginPage() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  function useDemoAccount(account: (typeof DEMO_ACCOUNTS)[number]) {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 text-primary">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="6" y="18" width="8" height="16" rx="1" fill="currentColor" />
                <rect x="16" y="12" width="8" height="22" rx="1" fill="currentColor" />
                <rect x="26" y="16" width="8" height="18" rx="1" fill="currentColor" />
                <path d="M4 18 L20 6 L36 18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="22" r="2.5" fill="currentColor" opacity="0.9" />
              </svg>
            </div>
            <span className="font-semibold text-xl">{brandConfig.shortName}</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">{t("loginTitle")}</h1>
          <p className="text-muted-foreground text-sm">{t("loginSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-[hsl(var(--border))] rounded-xl p-6 md:p-8 shadow-sm space-y-5">
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">{t("email")}</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" autoComplete="email" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">{t("password")}</label>
              <Link href={`/${locale}/forgot-password`} className="text-xs text-primary hover:underline">{t("forgotPassword")}</Link>
            </div>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" autoComplete="current-password" />
          </div>
          <Button type="submit" className="w-full h-11" disabled={loading}>{loading ? "..." : t("login")}</Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link href={`/${locale}/register`} className="text-primary font-medium hover:underline">{t("register")}</Link>
          </p>
        </form>

        <section className="mt-6 rounded-xl border border-[hsl(var(--border))] bg-card/70 p-5">
          <div className="mb-4">
            <h2 className="font-semibold">{t("demoTitle")}</h2>
            <p className="text-xs text-muted-foreground mt-1">{t("demoSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => useDemoAccount(account)}
                className="flex items-center justify-between gap-3 rounded-lg border border-[hsl(var(--border))] px-3 py-2.5 text-start text-sm transition-colors hover:border-[hsl(var(--primary-300))] hover:bg-primary/5"
              >
                <span className="font-medium">{t(`roles.${account.role}`)}</span>
                <span className="text-xs text-muted-foreground">{t("useDemo")}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{t("demoCredentials")}</p>
        </section>
      </div>
    </div>
  );
}
