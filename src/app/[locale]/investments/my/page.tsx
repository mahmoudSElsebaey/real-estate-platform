"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

interface InterestItem {
  _id: string;
  status: string;
  proposedAmount?: number;
  message?: string;
  createdAt: string;
  property?: { _id: string; title: { en: string; ar: string }; currency?: string };
}

export default function MyInvestmentInterestsPage() {
  const t = useTranslations("Investment");
  const locale = useLocale();
  const router = useRouter();
  const [items, setItems] = useState<InterestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/investments/interests?scope=mine");
        if (res.status === 401) { router.push(`/${locale}/login`); return; }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setItems(data.interests || []);
      } catch { setError(t("listError")); }
      finally { setLoading(false); }
    }
    load();
  }, [locale, router, t]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">...</p></div>;

  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2"><TrendingUp className="w-7 h-7 text-primary" />{t("myInterests")}</h1>
          <p className="text-muted-foreground mt-1">{t("myInterestsSubtitle")}</p>
        </div>
        {error && <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {items.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[hsl(var(--border))] rounded-xl">
            <p className="text-muted-foreground mb-4">{t("emptyMine")}</p>
            <Link href={`/${locale}/investments`} className="inline-flex h-10 px-5 items-center rounded-md bg-primary text-primary-foreground text-sm font-medium shadow">{t("browse")}</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const title = item.property ? (locale === "ar" ? item.property.title?.ar : item.property.title?.en) : "—";
              return (
                <div key={item._id} className="rounded-xl border border-[hsl(var(--border))] bg-card p-5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary">{t(`status.${item.status}` as any) || item.status}</span>
                    <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}</span>
                  </div>
                  {item.property && <Link href={`/${locale}/properties/${item.property._id}`} className="font-medium text-sm hover:text-primary block">{title}</Link>}
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
