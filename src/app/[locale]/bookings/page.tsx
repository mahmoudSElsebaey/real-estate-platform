"use client";

import { useEffect, useState } from "react";
import { AccountFrame } from "@/components/account/AccountFrame";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

interface BookingItem {
  _id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  estimatedTotal?: number;
  currency: string;
  message?: string;
  createdAt: string;
  property?: { _id: string; title: { en: string; ar: string }; location?: { city: string } };
}

export default function MyBookingsPage() {
  const t = useTranslations("Booking");
  const locale = useLocale();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/bookings?scope=mine");
        if (res.status === 401) { router.push(`/${locale}/login`); return; }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setBookings(data.bookings || []);
      } catch { setError(t("listError")); }
      finally { setLoading(false); }
    }
    load();
  }, [locale, router, t]);

  async function cancelBooking(id: string) {
    setCancelling(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)));
    } catch {}
    finally { setCancelling(null); }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">...</p></div>;

  return (
    <AccountFrame title={t("myBookings")} subtitle={t("myBookingsSubtitle")} eyebrow="AQARCO / BOOKINGS">
      <div>
        {error && <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {bookings.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[hsl(var(--border))] rounded-xl">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground mb-4">{t("emptyMine")}</p>
            <Link href={`/${locale}/discover?purpose=rent`} className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium rounded-md bg-primary text-primary-foreground shadow hover:bg-[hsl(var(--primary-600))] transition-colors">{t("browse")}</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const title = b.property ? (locale === "ar" ? b.property.title?.ar : b.property.title?.en) : "—";
              return (
                <div key={b._id} className="rounded-xl border border-[hsl(var(--border))] bg-card p-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary">{t(`status.${b.status}` as any) || b.status}</span>
                    <span className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}</span>
                  </div>
                  {b.property && <Link href={`/${locale}/properties/${b.property._id}`} className="font-medium text-sm hover:text-primary block">{title}</Link>}
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{t("checkIn")}: {new Date(b.checkIn).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")} → {t("checkOut")}: {new Date(b.checkOut).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}</p>
                    <p>{t("guests")}: {b.guests}{b.estimatedTotal != null && <> · {t("estimate")}: {b.estimatedTotal.toLocaleString()} {b.currency}</>}</p>
                  </div>
                  {b.status === "pending" && (
                    <button type="button" disabled={cancelling === b._id} onClick={() => cancelBooking(b._id)} className="text-sm text-red-600 hover:underline disabled:opacity-50">{t("cancel")}</button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountFrame>
  );
}
