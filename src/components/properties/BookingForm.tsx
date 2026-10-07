"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  propertyId: string;
  currency?: string;
}

export function BookingForm({ propertyId, currency = "EGP" }: BookingFormProps) {
  const t = useTranslations("Booking");
  const locale = useLocale();
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, checkIn, checkOut, guests, message: message || null }),
      });
      const data = await res.json();
      if (res.status === 401) { router.push(`/${locale}/login`); return; }
      if (!res.ok) { setError(data.error || t("error")); setLoading(false); return; }
      setSuccess(true);
      setMessage("");
    } catch { setError(t("error")); }
    finally { setLoading(false); }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 p-6 text-center">
        <p className="text-emerald-700 dark:text-emerald-300 font-medium mb-1">{t("successTitle")}</p>
        <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mb-4">{t("successMessage")}</p>
        <button type="button" onClick={() => router.push(`/${locale}/bookings`)} className="text-sm text-primary font-medium hover:underline">{t("viewMyBookings")}</button>
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
          <label className={labelClass}>{t("checkIn")}</label>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>{t("checkOut")}</label>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required className={inputClass} />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>{t("guests")}</label>
        <input type="number" min={1} max={50} value={guests} onChange={(e) => setGuests(parseInt(e.target.value || "1", 10))} required className={inputClass} />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>{t("message")}</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y" placeholder={t("messagePlaceholder")} />
      </div>
      <p className="text-xs text-muted-foreground">{t("currencyNote", { currency })}</p>
      <button type="submit" disabled={loading} className="w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-[hsl(var(--primary-600))] transition-colors disabled:opacity-60">{loading ? "..." : t("submit")}</button>
    </form>
  );
}
