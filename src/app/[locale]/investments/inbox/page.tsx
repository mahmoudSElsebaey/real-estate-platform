"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inbox } from "lucide-react";

interface InterestItem {
  _id: string;
  status: string;
  proposedAmount?: number;
  message?: string;
  createdAt: string;
  property?: { _id: string; title: { en: string; ar: string }; currency?: string };
  user?: { name: string; email: string; phone?: string };
}

const STATUS_OPTIONS = ["new", "contacted", "closed"] as const;

export default function InvestmentInboxPage() {
  const t = useTranslations("Investment");
  const locale = useLocale();
  const router = useRouter();
  const [items, setItems] = useState<InterestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/investments/interests?scope=inbox");
        if (res.status === 401) { router.push(`/${locale}/login`); return; }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setItems(data.interests || []);
      } catch { setError(t("listError")); }
      finally { setLoading(false); }
    }
    load();
  }, [locale, router, t]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/investments/interests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) setItems((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
    } catch {}
    finally { setUpdating(null); }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">...</p></div>;

  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2"><Inbox className="w-7 h-7 text-primary" />{t("inbox")}</h1>
          <p className="text-muted-foreground mt-1">{t("inboxSubtitle")}</p>
        </div>
        {error && <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {items.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[hsl(var(--border))] rounded-xl"><p className="text-muted-foreground">{t("emptyInbox")}</p></div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const title = item.property ? (locale === "ar" ? item.property.title?.ar : item.property.title?.en) : "—";
              return (
                <div key={item._id} className="rounded-xl border border-[hsl(var(--border))] bg-card p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <select value={item.status} disabled={updating === item._id} onChange={(e) => updateStatus(item._id, e.target.value)} className="h-8 px-2 rounded-md border border-[hsl(var(--input))] bg-background text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-ring">
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{t(`status.${s}` as any)}</option>)}
                    </select>
                    <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}</span>
                  </div>
                  {item.property && <Link href={`/${locale}/properties/${item.property._id}`} className="font-medium text-sm hover:text-primary block">{title}</Link>}
                  {item.user && <p className="text-sm"><span className="text-muted-foreground">{t("investor")}:</span> {item.user.name} · <a href={`mailto:${item.user.email}`} className="text-primary hover:underline">{item.user.email}</a></p>}
                  {item.proposedAmount != null && <p className="text-sm text-muted-foreground">{t("proposedAmount")}: {item.proposedAmount.toLocaleString()} {item.property?.currency || "EGP"}</p>}
                  {item.message && <p className="text-sm text-muted-foreground border-t border-[hsl(var(--border))] pt-2">{item.message}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
