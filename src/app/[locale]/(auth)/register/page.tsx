"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const [role, setRole] = useState<(typeof ROLE_OPTIONS)[number]>("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">{t("registerTitle")}</h1>
          <p className="text-muted-foreground text-sm">{t("registerSubtitle")}</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card border border-[hsl(var(--border))] rounded-xl p-6 md:p-8 shadow-sm space-y-5">
          {error && <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">{t("name")}</label>
            <input id="name" type="text" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} className="w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">{t("email")}</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">{t("password")}</label>
            <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">{t("role")}</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{t(`roles.${r}`)}</option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full h-11" disabled={loading}>{loading ? "..." : t("register")}</Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("hasAccount")}{" "}
            <Link href={`/${locale}/login`} className="text-primary font-medium hover:underline">{t("login")}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
