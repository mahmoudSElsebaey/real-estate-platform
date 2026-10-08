"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { GitCompare, X, Bed, Bath, Maximize2 } from "lucide-react";

interface CompareProperty {
  _id: string;
  title: { en: string; ar: string };
  type: string;
  purpose: string;
  price: number;
  rentalPrice?: number;
  currency: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  yearBuilt?: number;
  furnishing?: string;
  location: { city: string; district?: string };
  images: { url: string; isPrimary?: boolean }[];
}

const COMPARE_KEY = "aqarco_compare";

export function getCompareIds(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]"); }
  catch { return []; }
}

export function setCompareIds(ids: string[]) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(ids.slice(0, 4)));
}

export function toggleCompare(id: string): string[] {
  const current = getCompareIds();
  const exists = current.includes(id);
  const next = exists ? current.filter((x) => x !== id) : [...current, id].slice(0, 4);
  setCompareIds(next);
  return next;
}

export default function ComparePage() {
  const t = useTranslations("Compare");
  const tForm = useTranslations("Listings.form");
  const locale = useLocale();
  const [properties, setProperties] = useState<CompareProperty[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadFromStorage() {
    const ids = getCompareIds();
    if (ids.length === 0) { setProperties([]); setLoading(false); return; }
    try {
      const results = await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`/api/properties/${id}`);
          if (!res.ok) return null;
          const data = await res.json();
          return data.property as CompareProperty;
        })
      );
      setProperties(results.filter(Boolean) as CompareProperty[]);
    } catch { setProperties([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadFromStorage(); }, []);

  function remove(id: string) {
    const next = getCompareIds().filter((x) => x !== id);
    setCompareIds(next);
    setProperties((prev) => prev.filter((p) => p._id !== id));
  }

  function clearAll() {
    setCompareIds([]);
    setProperties([]);
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">...</p></div>;

  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
              <GitCompare className="w-7 h-7 text-primary" />{t("title")}
            </h1>
            <p className="text-muted-foreground mt-1">{t("subtitle", { count: properties.length })}</p>
          </div>
          {properties.length > 0 && (
            <button type="button" onClick={clearAll} className="text-sm text-muted-foreground hover:text-foreground">{t("clearAll")}</button>
          )}
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[hsl(var(--border))] rounded-xl">
            <GitCompare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground mb-2">{t("empty")}</p>
            <p className="text-sm text-muted-foreground mb-6">{t("emptyHint")}</p>
            <Link href={`/${locale}/discover`} className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium rounded-md bg-primary text-primary-foreground shadow hover:bg-[hsl(var(--primary-600))] transition-colors">{t("browse")}</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="text-start text-sm font-medium text-muted-foreground p-3 w-32">{t("feature")}</th>
                  {properties.map((p) => {
                    const title = locale === "ar" ? p.title.ar : p.title.en;
                    const img = p.images?.find((i) => i.isPrimary)?.url || p.images?.[0]?.url;
                    return (
                      <th key={p._id} className="p-3 align-top">
                        <div className="relative rounded-lg overflow-hidden border border-[hsl(var(--border))]">
                          <button type="button" onClick={() => remove(p._id)} className="absolute top-2 end-2 z-10 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="aspect-[4/3] bg-muted">
                            {img ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={img} alt={title} className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <div className="p-3 text-start">
                            <Link href={`/${locale}/properties/${p._id}`} className="font-semibold text-sm line-clamp-2 hover:text-primary">{title}</Link>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-t border-[hsl(var(--border))]">
                  <td className="p-3 text-muted-foreground font-medium">{t("price")}</td>
                  {properties.map((p) => (
                    <td key={p._id} className="p-3 font-semibold text-primary">
                      {p.purpose === "rent" && p.rentalPrice
                        ? `${p.rentalPrice.toLocaleString()} ${p.currency}`
                        : `${p.price.toLocaleString()} ${p.currency}`}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-[hsl(var(--border))]">
                  <td className="p-3 text-muted-foreground font-medium">{t("type")}</td>
                  {properties.map((p) => <td key={p._id} className="p-3">{tForm(`types.${p.type}` as any) || p.type}</td>)}
                </tr>
                <tr className="border-t border-[hsl(var(--border))]">
                  <td className="p-3 text-muted-foreground font-medium">{t("purpose")}</td>
                  {properties.map((p) => <td key={p._id} className="p-3">{tForm(`purposes.${p.purpose}` as any) || p.purpose}</td>)}
                </tr>
                <tr className="border-t border-[hsl(var(--border))]">
                  <td className="p-3 text-muted-foreground font-medium">{t("location")}</td>
                  {properties.map((p) => (
                    <td key={p._id} className="p-3">{p.location.city}{p.location.district ? ` · ${p.location.district}` : ""}</td>
                  ))}
                </tr>
                <tr className="border-t border-[hsl(var(--border))]">
                  <td className="p-3 text-muted-foreground font-medium"><span className="inline-flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {t("bedrooms")}</span></td>
                  {properties.map((p) => <td key={p._id} className="p-3">{p.bedrooms ?? "—"}</td>)}
                </tr>
                <tr className="border-t border-[hsl(var(--border))]">
                  <td className="p-3 text-muted-foreground font-medium"><span className="inline-flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {t("bathrooms")}</span></td>
                  {properties.map((p) => <td key={p._id} className="p-3">{p.bathrooms ?? "—"}</td>)}
                </tr>
                <tr className="border-t border-[hsl(var(--border))]">
                  <td className="p-3 text-muted-foreground font-medium"><span className="inline-flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> {t("area")}</span></td>
                  {properties.map((p) => <td key={p._id} className="p-3">{p.area} m²</td>)}
                </tr>
                <tr className="border-t border-[hsl(var(--border))]">
                  <td className="p-3 text-muted-foreground font-medium">{t("furnishing")}</td>
                  {properties.map((p) => (
                    <td key={p._id} className="p-3">{p.furnishing ? tForm(`furnishingOptions.${p.furnishing}` as any) || p.furnishing : "—"}</td>
                  ))}
                </tr>
                <tr className="border-t border-[hsl(var(--border))]">
                  <td className="p-3 text-muted-foreground font-medium">{t("yearBuilt")}</td>
                  {properties.map((p) => <td key={p._id} className="p-3">{p.yearBuilt ?? "—"}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
