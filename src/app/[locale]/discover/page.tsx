"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PropertyCard, PropertyCardData } from "@/components/properties/PropertyCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PROPERTY_TYPES, LISTING_PURPOSE } from "@/models/Property";

function DiscoverContent() {
  const t = useTranslations("Discover");
  const tForm = useTranslations("Listings.form");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = searchParams.get("q") || "";
  const purpose = searchParams.get("purpose") || "";
  const type = searchParams.get("type") || "";
  const city = searchParams.get("city") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const bedrooms = searchParams.get("bedrooms") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [localQ, setLocalQ] = useState(q);
  const [localCity, setLocalCity] = useState(city);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      if (!("page" in updates)) params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  useEffect(() => {
    setLocalQ(q);
    setLocalCity(city);
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [q, city, minPrice, maxPrice]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (purpose) params.set("purpose", purpose);
        if (type) params.set("type", type);
        if (city) params.set("city", city);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (bedrooms) params.set("bedrooms", bedrooms);
        if (sort) params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", "12");
        const res = await fetch(`/api/properties?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setProperties(data.properties || []);
        setPagination({
          page: data.pagination?.page || 1,
          pages: data.pagination?.pages || 1,
          total: data.pagination?.total || 0,
        });
      } catch {
        setError(t("error"));
        setProperties([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [q, purpose, type, city, minPrice, maxPrice, bedrooms, sort, page, t]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({
      q: localQ || null,
      city: localCity || null,
      minPrice: localMinPrice || null,
      maxPrice: localMaxPrice || null,
    });
  }

  const inputClass =
    "h-10 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full";

  return (
    <div className="min-h-[70vh] py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-1">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className={`${inputClass} ps-10`}
            />
          </div>
          <input
            value={localCity}
            onChange={(e) => setLocalCity(e.target.value)}
            placeholder={t("cityPlaceholder")}
            className={`${inputClass} sm:w-40`}
          />
          <button
            type="submit"
            className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-[hsl(var(--primary-600))] transition-colors"
          >
            {t("search")}
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="h-10 px-4 rounded-md border border-[hsl(var(--border))] text-sm font-medium inline-flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t("filters")}
          </button>
        </form>

        {filtersOpen && (
          <div className="mb-6 p-4 md:p-5 rounded-xl border border-[hsl(var(--border))] bg-card grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t("purpose")}</label>
              <select
                value={purpose}
                onChange={(e) => updateParams({ purpose: e.target.value || null })}
                className={inputClass}
              >
                <option value="">{t("any")}</option>
                {LISTING_PURPOSE.map((p) => (
                  <option key={p} value={p}>
                    {tForm(`purposes.${p}` as any)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t("type")}</label>
              <select
                value={type}
                onChange={(e) => updateParams({ type: e.target.value || null })}
                className={inputClass}
              >
                <option value="">{t("any")}</option>
                {PROPERTY_TYPES.map((pt) => (
                  <option key={pt} value={pt}>
                    {tForm(`types.${pt}` as any)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t("minPrice")}</label>
              <input
                type="number"
                min={0}
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                onBlur={() => updateParams({ minPrice: localMinPrice || null })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t("maxPrice")}</label>
              <input
                type="number"
                min={0}
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                onBlur={() => updateParams({ maxPrice: localMaxPrice || null })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t("bedrooms")}</label>
              <select
                value={bedrooms}
                onChange={(e) => updateParams({ bedrooms: e.target.value || null })}
                className={inputClass}
              >
                <option value="">{t("any")}</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}+
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t("sort")}</label>
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className={inputClass}
              >
                <option value="newest">{t("sortNewest")}</option>
                <option value="price_asc">{t("sortPriceAsc")}</option>
                <option value="price_desc">{t("sortPriceDesc")}</option>
                <option value="area_desc">{t("sortArea")}</option>
              </select>
            </div>
            <div className="col-span-2 md:col-span-4 lg:col-span-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setLocalQ("");
                  setLocalCity("");
                  setLocalMinPrice("");
                  setLocalMaxPrice("");
                  router.push(pathname);
                }}
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                {t("clearFilters")}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-5 text-sm text-muted-foreground">
          <span>{loading ? "..." : t("resultsCount", { count: pagination.total })}</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-[hsl(var(--border))] overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-muted-foreground">{error}</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[hsl(var(--border))] rounded-xl">
            <p className="text-muted-foreground mb-2">{t("empty")}</p>
            <p className="text-sm text-muted-foreground">{t("emptyHint")}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={page <= 1}
                  onClick={() => updateParams({ page: String(page - 1) })}
                  className="h-9 px-3 rounded-md border border-[hsl(var(--border))] text-sm disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  {t("prev")}
                </button>
                <span className="text-sm text-muted-foreground px-2">
                  {page} / {pagination.pages}
                </span>
                <button
                  disabled={page >= pagination.pages}
                  onClick={() => updateParams({ page: String(page + 1) })}
                  className="h-9 px-3 rounded-md border border-[hsl(var(--border))] text-sm disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  {t("next")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">...</p>
        </div>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}
