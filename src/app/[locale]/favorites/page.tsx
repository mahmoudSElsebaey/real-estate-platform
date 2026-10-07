"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PropertyCard, PropertyCardData } from "@/components/properties/PropertyCard";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const t = useTranslations("Favorites");
  const locale = useLocale();
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/favorites");
        if (res.status === 401) { router.push(`/${locale}/login`); return; }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setProperties(data.favorites || []);
      } catch { setError(t("error")); }
      finally { setLoading(false); }
    }
    load();
  }, [locale, router, t]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">...</p></div>;
  }

  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Heart className="w-7 h-7 text-primary" />
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("subtitle", { count: properties.length })}</p>
        </div>
        {error && <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {properties.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[hsl(var(--border))] rounded-xl">
            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground mb-2">{t("empty")}</p>
            <p className="text-sm text-muted-foreground mb-6">{t("emptyHint")}</p>
            <Link href={`/${locale}/discover`} className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium rounded-md bg-primary text-primary-foreground shadow hover:bg-[hsl(var(--primary-600))] transition-colors">{t("browse")}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
