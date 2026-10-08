"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6">
            <span className="text-xl font-semibold tracking-tight">
              {brandConfig.brandName}
            </span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{t("loginTitle")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("loginSubtitle")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[hsl(var(--border))] bg-card p-6 md:p-8 space-y-4 shadow-sm"
        >
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t("email")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t("password")}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : t("login")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link
              href={`/${locale}/register`}
              className="text-primary font-medium hover:underline"
            >
              {t("register")}
            </Link>
          </p>
        </form>

        <div className="mt-6 rounded-xl border border-dashed border-[hsl(var(--border))] p-4">
          <p className="text-sm font-medium mb-1">{t("demoTitle")}</p>
          <p className="text-xs text-muted-foreground mb-3">{t("demoSubtitle")}</p>
          <div className="flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillDemo(acc.email)}
                className="h-8 px-2.5 rounded-md border border-[hsl(var(--border))] text-xs font-medium hover:bg-muted transition-colors"
              >
                {t(`roles.${acc.role}` as any)}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            {t("demoCredentials")}
          </p>
        </div>
      </div>
    </div>
  );
}
