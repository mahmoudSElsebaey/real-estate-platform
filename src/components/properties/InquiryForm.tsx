"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

interface InquiryFormProps {
  propertyId: string;
  defaultName?: string;
  defaultEmail?: string;
  initialType?: "info" | "visit" | "offer" | "other";
  onSuccess?: () => void;
}

export function InquiryForm({
  propertyId,
  defaultName = "",
  defaultEmail = "",
  initialType = "info",
  onSuccess,
}: InquiryFormProps) {
  const t = useTranslations("Inquiry");
  const locale = useLocale();
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"info" | "visit" | "offer" | "other">(initialType);
  const [message, setMessage] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          name,
          email,
          phone: phone || null,
          type,
          message,
          preferredDate: preferredDate || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("error"));
        setLoading(false);
        return;
      }
      setSuccess(true);
      setMessage("");
      setPhone("");
      setPreferredDate("");
      onSuccess?.();
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="relative overflow-hidden rounded-[24px] border border-[#24483a] bg-[#102019] p-7 text-white shadow-[0_18px_50px_rgba(16,32,25,.18)] sm:p-8">
        <div className="absolute -end-16 -top-20 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -start-20 -bottom-24 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative mx-auto max-w-md text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-emerald-300/25 bg-emerald-400/15 text-emerald-300 shadow-inner">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">
            <Sparkles className="h-3 w-3" />
            AQARCO
          </div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{t("successTitle")}</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/65">{t("successMessage")}</p>
          <div className="mx-auto mt-6 flex max-w-sm items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs text-white/60">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />
            <span>{locale === "ar" ? "بياناتك محمية وسنتعامل مع طلبك بسرية." : "Your details are protected and handled privately."}</span>
          </div>
          <button type="button" onClick={() => setSuccess(false)} className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/15">{t("sendAnother")}</button>
        </div>
      </div>
    );
  }

  const inputClass = "w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "text-sm font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>{t("name")}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>{t("email")}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>{t("phone")}</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>{t("type")}</label>
          <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className={inputClass}>
            <option value="info">{t("types.info")}</option>
            <option value="visit">{t("types.visit")}</option>
            <option value="offer">{t("types.offer")}</option>
            <option value="other">{t("types.other")}</option>
          </select>
        </div>
      </div>
      {type === "visit" && (
        <div className="space-y-1.5">
          <label className={labelClass}>{t("preferredDate")}</label>
          <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className={inputClass} />
        </div>
      )}
      <div className="space-y-1.5">
        <label className={labelClass}>{t("message")}</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required minLength={5} rows={4} className="w-full px-3 py-2 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
      </div>
      <button type="submit" disabled={loading} className="w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-[hsl(var(--primary-600))] transition-colors disabled:opacity-60">
        {loading ? "..." : t("submit")}
      </button>
    </form>
  );
}
