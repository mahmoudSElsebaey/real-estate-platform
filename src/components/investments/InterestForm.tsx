"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface InterestFormProps {
  propertyId: string;
  currency?: string;
}

export function InterestForm({ propertyId, currency = "EGP" }: InterestFormProps) {
  const t = useTranslations("Investment");
  const locale = useLocale();
  const router = useRouter();
  const [proposedAmount, setProposedAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/investments/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          proposedAmount: proposedAmount ? parseFloat(proposedAmount) : null,
          message: message || null,
        }),
      });
      const data = await res.json();
      if (res.status === 401) { router.push(`/${locale}/login`); return; }
      if (!res.ok) { setError(data.error || t("error")); setLoading(false); return; }
      setSuccess(true);
      setMessage("");
      setProposedAmount("");
    } catch { setError(t("error")); }
    finally { setLoading(false); }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-emerald-700 font-medium mb-1">{t("successTitle")}</p>
        <p className="text-sm text-emerald-600/80 mb-4">{t("successMessage")}</p>
        <button type="button" onClick={() => router.push(`/${locale}/investments/my`)} className="text-sm text-primary font-medium hover:underline">{t("viewMyInterests")}</button>
      </div>
    );
  }

  const inputClass = "w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("proposedAmount")} ({currency})</label>
        <input type="number" min={0} value={proposedAmount} onChange={(e) => setProposedAmount(e.target.value)} className={inputClass} placeholder={t("amountPlaceholder")} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("message")}</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y" placeholder={t("messagePlaceholder")} />
      </div>
      <button type="submit" disabled={loading} className="w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-[hsl(var(--primary-600))] transition-colors disabled:opacity-60">{loading ? "..." : t("submit")}</button>
    </form>
  );
}
