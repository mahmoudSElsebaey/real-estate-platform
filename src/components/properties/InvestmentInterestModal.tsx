"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, Send, Sparkles, X } from "lucide-react";

export function InvestmentInterestModal({
  open,
  propertyId,
  propertyTitle,
  onClose,
}: {
  open: boolean;
  propertyId: string;
  propertyTitle: string;
  onClose: () => void;
}) {
  const t = useTranslations("Investment");
  const locale = useLocale();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setAmount("");
    setMessage("");
    setSuccess(false);
    setError("");
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  if (!open) return null;

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/investments/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          proposedAmount: amount || undefined,
          message: message || undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = `/${locale}/login`;
        return;
      }
      if (!res.ok) {
        setError(data.error || t("error"));
        return;
      }
      setSuccess(true);
    } catch {
      setError(t("error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="w-full max-w-lg overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-2xl">
        <div className="relative bg-[#102019] px-6 py-6 text-white sm:px-8">
          <button type="button" onClick={onClose} aria-label={locale === "ar" ? "إغلاق" : "Close"} className="absolute end-4 top-4 rounded-full bg-white/10 p-2 transition hover:bg-white/20">
            <X className="h-4 w-4" />
          </button>
          <div className="mb-2 inline-flex rounded-full border border-white/15 bg-white/10 p-2"><Sparkles className="h-4 w-4" /></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">{locale === "ar" ? "فرصة استثمارية" : "INVESTMENT OPPORTUNITY"}</p>
          <h2 className="mt-2 pe-8 text-2xl font-semibold">{t("expressTitle")}</h2>
          <p className="mt-1 text-sm text-white/60">{propertyTitle}</p>
        </div>
        {success ? (
          <div className="px-6 py-10 text-center sm:px-8">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary"><Sparkles className="h-6 w-6" /></div>
            <h3 className="text-lg font-semibold">{t("successTitle")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("successMessage")}</p>
            <button type="button" onClick={onClose} className="mt-6 h-11 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground">{t("close")}</button>
          </div>
        ) : (
          <div className="space-y-5 px-6 py-6 sm:px-8">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("proposedAmount")}</label>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="0" placeholder={t("amountPlaceholder")} className="h-11 w-full rounded-md border border-[hsl(var(--input))] bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("message")}</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder={t("messagePlaceholder")} className="w-full resize-none rounded-md border border-[hsl(var(--input))] bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button type="button" disabled={submitting} onClick={submit} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground shadow transition hover:bg-[hsl(var(--primary-600))] disabled:opacity-60">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {submitting ? "..." : t("submit")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
