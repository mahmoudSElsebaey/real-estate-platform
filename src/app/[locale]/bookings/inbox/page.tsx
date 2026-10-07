"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inbox } from "lucide-react";

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
  property?: { _id: string; title: { en: string; ar: string } };
  user?: { name: string; email: string; phone?: string };
}

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled", "completed"] as const;

export default function BookingsInboxPage() {
  const t = useTranslations("Booking");
  const locale = useLocale();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/bookings?scope=inbox");
        if (res.status === 401) { router.push(`/${locale}/login`); return; }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setBookings(data.bookings || []);
      } catch { setError(t("listError")); }
      finally { setLoading(false); }
    }
    load();
  }, [locale, router, t]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
    } catch {}
    finally { setUpdating(null); }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">...</p></div>;

  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Inbox className="w-7 h-7 text-primary" />{t("inbox")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("inboxSubtitle")}</p>
        </div>
        {error && <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {bookings.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[hsl(var(--border))] rounded-xl">
            <Inbox className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">{t("emptyInbox")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const title = b.property ? (locale === "ar" ? b.property.title?.ar : b.property.title?.en) : "—";
              return (
                <div key={b._id} className="rounded-xl border border-[hsl(var(--border))] bg-card p-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <select value={b.status} disabled={updating === b._id} onChange={(e) => updateStatus(b._id, e.target.value)} className="h-8 px-2 rounded-md border border-[hsl(var(--input))] bg-background text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-ring">
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{t(`status.${s}` as any)}</option>)}
                    </select>
                    <span className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}</span>
                  </div>
                  {b.property && <Link href={`/${locale}/properties/${b.property._id}`} className="font-medium text-sm hover:text-primary block">{title}</Link>}
                  <div className="text-sm space-y-1">
                    {b.user && <p><span className="text-muted-foreground">{t("guest")}:</span> {b.user.name} · <a href={`mailto:${b.user.email}`} className="text-primary hover:underline">{b.user.email}</a></p>}
                    <p className="text-muted-foreground">{t("checkIn")}: {new Date(b.checkIn).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")} → {t("checkOut")}: {new Date(b.checkOut).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}</p>
                    <p className="text-muted-foreground">{t("guests")}: {b.guests}{b.estimatedTotal != null && <> · {t("estimate")}: {b.estimatedTotal.toLocaleString()} {b.currency}</>}</p>
                    {b.message && <p className="border-t border-[hsl(var(--border))] pt-2 text-muted-foreground">{b.message}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
