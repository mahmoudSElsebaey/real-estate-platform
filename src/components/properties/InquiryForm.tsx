"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface InquiryFormProps {
  propertyId: string;
  defaultName?: string;
  defaultEmail?: string;
  onSuccess?: () => void;
}

export function InquiryForm({
  propertyId,
  defaultName = "",
  defaultEmail = "",
  onSuccess,
}: InquiryFormProps) {
  const t = useTranslations("Inquiry");
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"info" | "visit" | "offer" | "other">("info");
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
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 p-6 text-center">
        <p className="text-emerald-700 dark:text-emerald-300 font-medium mb-1">{t("successTitle")}</p>
        <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">{t("successMessage")}</p>
        <button type="button" onClick={() => setSuccess(false)} className="mt-4 text-sm text-primary font-medium hover:underline">{t("sendAnother")}</button>
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
