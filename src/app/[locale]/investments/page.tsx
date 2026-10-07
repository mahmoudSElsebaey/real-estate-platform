"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { TrendingUp, MapPin, Search } from "lucide-react";

interface Opportunity {
  _id: string;
  title: { en: string; ar: string };
  type: string;
  purpose: string;
  price: number;
  currency: string;
  area?: number;
  location: { city: string; district?: string; country?: string };
  images?: { url: string; isPrimary?: boolean }[];
  isFeatured?: boolean;
}

export default function InvestmentsPage() {
  const t = useTranslations("Investment");
  const tForm = useTranslations("Listings.form");
  const locale = useLocale();
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");

  async function load(searchQ = q, searchCity = city) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchQ) params.set("q", searchQ);
      if (searchCity) params.set("city", searchCity);
      const res = await fetch(`/api/investments?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setItems(data.opportunities || []);
    } catch { setError(t("listError")); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load();
  }

  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-primary" />{t("title")}
            </h1>
            <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>
          <Link href={`/${locale}/investments/my`} className="h-10 px-4 rounded-md border border-[hsl(var(--border))] text-sm font-medium inline-flex items-center hover:bg-muted transition-colors">{t("myInterests")}</Link>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPlaceholder")} className="w-full h-10 ps-10 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("cityPlaceholder")} className="h-10 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm sm:w-40 focus:outline-none focus:ring-2 focus:ring-ring" />
          <button type="submit" className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-[hsl(var(--primary-600))] transition-colors">{t("search")}</button>
        </form>

        {error && <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[hsl(var(--border))] overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" /><div className="p-4 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[hsl(var(--border))] rounded-xl">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => {
              const title = locale === "ar" ? p.title?.ar : p.title?.en;
              const img = p.images?.find((i) => i.isPrimary)?.url || p.images?.[0]?.url;
              return (
                <Link key={p._id} href={`/${locale}/properties/${p._id}`} className="group rounded-xl border border-[hsl(var(--border))] bg-card overflow-hidden transition-all hover:shadow-lg hover:border-[hsl(var(--primary-300))]">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {img ? <img src={img} alt={title || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">{t("noImage")}</div>}
                    {p.isFeatured && <span className="absolute top-3 start-3 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[hsl(var(--accent-500))] text-[hsl(var(--primary-900))]">{t("featured")}</span>}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5 shrink-0" />{[p.location.district, p.location.city].filter(Boolean).join(" · ")}</p>
                    <div className="flex items-center justify-between pt-1">
                      <p className="font-semibold text-primary">{p.price?.toLocaleString()} {p.currency}</p>
                      <span className="text-xs text-muted-foreground">{tForm(`types.${p.type}` as any) || p.type}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
