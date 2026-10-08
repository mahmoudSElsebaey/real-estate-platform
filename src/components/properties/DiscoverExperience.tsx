"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUpRight, Building2, Filter, MapPin, Search, Sparkles, TrendingUp } from "lucide-react";
import { PropertyCard, type PropertyCardData } from "@/components/properties/PropertyCard";
import { PROPERTY_TYPES, LISTING_PURPOSE } from "@/lib/properties/constants";

type Mode = "sale" | "rent" | "invest" | "discover";

const images = {
  sale: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=88",
  rent: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=88",
  invest: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=88",
  discover: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=2200&q=88",
};

function DiscoverInner() {
  const locale = useLocale();
  const ar = locale === "ar";
  const t = useTranslations("Discover");
  const tForm = useTranslations("Listings.form");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requestedPurpose = searchParams.get("purpose") as Mode | null;
  const mode: Mode = requestedPurpose === "sale" || requestedPurpose === "rent" || requestedPurpose === "invest" ? requestedPurpose : "discover";

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

  const copy = useMemo(() => {
    const data = {
      sale: ar
        ? { eyebrow: "الامتلاك يبدأ باختيار صحيح", title: "بيوت تستحق أن تكون عنوانك.", text: "اكتشف عقارات مختارة للشراء، من الشقق العصرية إلى الفلل الهادئة، بتجربة بحث تضع الصورة والمكان والقيمة في المقدمة.", cta: "تصفح عقارات للبيع", stat: "عقارات للبيع" }
        : { eyebrow: "OWN WITH CONFIDENCE", title: "Find a home worth calling yours.", text: "Explore a curated collection of homes where architecture, location and long-term value come first.", cta: "Explore homes for sale", stat: "homes for sale" },
      rent: ar
        ? { eyebrow: "حياة مرنة. مكان يشبهك.", title: "استأجر مساحتك القادمة.", text: "من الإقامة الهادئة إلى المدينة النابضة، اعثر على مكان يناسب إيقاع حياتك بدون تعقيد.", cta: "اكتشف الإيجارات", stat: "خيارات للإيجار" }
        : { eyebrow: "LIVE YOUR WAY", title: "Rent a place that feels right.", text: "From calm residences to connected city living, discover flexible spaces built around your lifestyle.", cta: "Explore rentals", stat: "rental options" },
      invest: ar
        ? { eyebrow: "القيمة لا تبدأ من السعر", title: "استثمر في أماكن لها مستقبل.", text: "استكشف فرصًا عقارية مختارة وقيّم الموقع والمساحة والغرض قبل اتخاذ قرارك الاستثماري.", cta: "استكشف فرص الاستثمار", stat: "فرص استثمارية" }
        : { eyebrow: "VALUE BEYOND THE PRICE", title: "Invest where the future is being built.", text: "Explore curated real-estate opportunities and evaluate location, asset type and long-term potential before you move.", cta: "Explore investments", stat: "investment opportunities" },
      discover: ar
        ? { eyebrow: "عقاركو / المجموعة الكاملة", title: "اكتشف العقار بالطريقة التي تناسبك.", text: "ابحث، صفِّ، قارن، واحفظ العقارات التي تستحق وقتك.", cta: "ابدأ البحث", stat: "عقارات مختارة" }
        : { eyebrow: "AQARCO / THE COLLECTION", title: "Discover property on your terms.", text: "Search, filter, compare and save the places that deserve your attention.", cta: "Start exploring", stat: "curated properties" },
    };
    return data[mode];
  }, [ar, mode]);

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    });
    if (!("page" in updates)) params.delete("page");
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }, [pathname, router, searchParams]);

  useEffect(() => {
    setLocalQ(q); setLocalCity(city); setLocalMinPrice(minPrice); setLocalMaxPrice(maxPrice);
  }, [q, city, minPrice, maxPrice]);

  useEffect(() => {
    async function load() {
      setLoading(true); setError("");
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
        params.set("page", String(page)); params.set("limit", "12");
        const res = await fetch(`/api/properties?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setProperties(data.properties || []);
        setPagination({ page: data.pagination?.page || 1, pages: data.pagination?.pages || 1, total: data.pagination?.total || 0 });
      } catch {
        setError(t("error")); setProperties([]);
      } finally { setLoading(false); }
    }
    load();
  }, [q, purpose, type, city, minPrice, maxPrice, bedrooms, sort, page, t]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: localQ || null, city: localCity || null, minPrice: localMinPrice || null, maxPrice: localMaxPrice || null });
  }

  const field = "h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <main className="bg-background">
      <section className="relative min-h-[650px] overflow-hidden bg-neutral-950 text-white">
        <img src={images[mode]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/10" />
        <div className="relative mx-auto flex min-h-[650px] max-w-7xl flex-col justify-end px-4 pb-14 pt-32 sm:px-6 lg:px-8 lg:pb-20">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-white/70"><span className="h-px w-10 bg-white/60" />{copy.eyebrow}</div>
            <h1 className="max-w-4xl text-5xl font-medium tracking-[-0.04em] sm:text-6xl lg:text-8xl">{copy.title}</h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{copy.text}</p>
            <a href="#collection" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-neutral-950 transition hover:-translate-y-0.5">{copy.cta}<ArrowDown className="h-4 w-4" /></a>
          </div>
          <div className="mt-12 grid max-w-3xl grid-cols-3 border-y border-white/20 py-5">
            <div><p className="text-2xl font-semibold">{pagination.total || "—"}</p><p className="mt-1 text-xs uppercase tracking-wider text-white/55">{copy.stat}</p></div>
            <div className="border-s border-white/20 ps-5"><p className="text-2xl font-semibold">EN / AR</p><p className="mt-1 text-xs uppercase tracking-wider text-white/55">{ar ? "تجربة ثنائية اللغة" : "Bilingual experience"}</p></div>
            <div className="border-s border-white/20 ps-5"><p className="text-2xl font-semibold">01</p><p className="mt-1 text-xs uppercase tracking-wider text-white/55">{ar ? "منصة واحدة" : "One platform"}</p></div>
          </div>
        </div>
      </section>

      <section id="collection" className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="grid gap-2 rounded-[28px] border border-border bg-card p-3 shadow-2xl md:grid-cols-[1.5fr_1fr_auto_auto]">
          <div className="relative"><Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={localQ} onChange={(e) => setLocalQ(e.target.value)} placeholder={t("searchPlaceholder")} className={`${field} ps-11 border-transparent bg-muted/50`} /></div>
          <input value={localCity} onChange={(e) => setLocalCity(e.target.value)} placeholder={t("cityPlaceholder")} className={`${field} border-transparent bg-muted/50`} />
          <button type="submit" className="h-12 rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">{t("search")}</button>
          <button type="button" onClick={() => setFiltersOpen((v) => !v)} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border px-5 text-sm font-semibold transition hover:bg-muted"><Filter className="h-4 w-4" />{t("filters")}</button>
        </form>
      </section>

      {filtersOpen && (
        <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
          <div className="grid gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm md:grid-cols-3 lg:grid-cols-6">
            <select value={purpose} onChange={(e) => updateParams({ purpose: e.target.value || null })} className={field}><option value="">{t("purpose")}</option>{LISTING_PURPOSE.map((p) => <option key={p} value={p}>{tForm(`purposes.${p}` as any)}</option>)}</select>
            <select value={type} onChange={(e) => updateParams({ type: e.target.value || null })} className={field}><option value="">{t("type")}</option>{PROPERTY_TYPES.map((p) => <option key={p} value={p}>{tForm(`types.${p}` as any)}</option>)}</select>
            <input type="number" value={localMinPrice} onChange={(e) => setLocalMinPrice(e.target.value)} onBlur={() => updateParams({ minPrice: localMinPrice || null })} placeholder={t("minPrice")} className={field} />
            <input type="number" value={localMaxPrice} onChange={(e) => setLocalMaxPrice(e.target.value)} onBlur={() => updateParams({ maxPrice: localMaxPrice || null })} placeholder={t("maxPrice")} className={field} />
            <select value={bedrooms} onChange={(e) => updateParams({ bedrooms: e.target.value || null })} className={field}><option value="">{t("bedrooms")}</option>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}+</option>)}</select>
            <select value={sort} onChange={(e) => updateParams({ sort: e.target.value })} className={field}><option value="newest">{t("sortNewest")}</option><option value="price_asc">{t("sortPriceAsc")}</option><option value="price_desc">{t("sortPriceDesc")}</option><option value="area_desc">{t("sortArea")}</option></select>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">{mode === "discover" ? "AQARCO COLLECTION" : mode.toUpperCase()}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Sparkles className="h-4 w-4 text-primary" />{t("resultsCount", { count: pagination.total })}</div>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-3xl bg-muted" />)}</div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-700">{error}</div>
        ) : properties.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-border bg-muted/30 p-16 text-center"><Building2 className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-4 text-xl font-semibold">{t("empty")}</h3><p className="mt-2 text-sm text-muted-foreground">{t("emptyHint")}</p></div>
        ) : (
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{properties.map((property) => <PropertyCard key={property._id} property={property} />)}</div>
        )}

        {pagination.pages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button disabled={page <= 1} onClick={() => updateParams({ page: String(page - 1) })} className="rounded-full border border-border px-5 py-2.5 text-sm disabled:opacity-40">{t("prev")}</button>
            <span className="px-3 text-sm text-muted-foreground">{page} / {pagination.pages}</span>
            <button disabled={page >= pagination.pages} onClick={() => updateParams({ page: String(page + 1) })} className="rounded-full border border-border px-5 py-2.5 text-sm disabled:opacity-40">{t("next")}</button>
          </div>
        )}
      </section>

      <section className={`border-t border-border ${mode === "invest" ? "bg-neutral-950 text-white" : "bg-muted/35"}`}>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.24em] opacity-60">{mode === "invest" ? "AQARCO INVEST" : "AQARCO"}</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{mode === "invest" ? (ar ? "قرار استثماري أفضل يبدأ بمعلومة أوضح." : "A better investment decision starts with better information.") : (ar ? "اكتشف مكانك القادم بثقة." : "Discover your next place with confidence.")}</h2></div>
          <a href="#collection" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">{ar ? "استكشف المجموعة" : "Explore collection"}<ArrowUpRight className="h-4 w-4" /></a>
        </div>
      </section>
    </main>
  );
}

export default function DiscoverExperience() {
  return <Suspense fallback={<div className="min-h-screen animate-pulse bg-muted" />}><DiscoverInner /></Suspense>;
}
