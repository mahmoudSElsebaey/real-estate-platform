"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Bed, Bath, Maximize2, MapPin, ArrowLeft, Building2 } from "lucide-react";

interface PropertyDetail {
  _id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  type: string;
  purpose: string;
  status: string;
  price: number;
  rentalPrice?: number;
  currency: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  furnishing?: string;
  amenities: string[];
  location: { city: string; district?: string; address?: string; country: string };
  images: { url: string; isPrimary?: boolean; alt?: string }[];
  views?: number;
  owner?: { name: string; email?: string; phone?: string };
}

export default function PropertyDetailPage() {
  const t = useTranslations("PropertyDetail");
  const tForm = useTranslations("Listings.form");
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) { setError(t("notFound")); setLoading(false); return; }
        const data = await res.json();
        setProperty(data.property);
      } catch { setError(t("error")); }
      finally { setLoading(false); }
    }
    if (id) load();
  }, [id, t]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">...</p></div>;
  if (error || !property) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{error || t("notFound")}</p>
        <Link href={`/${locale}/discover`} className="text-primary text-sm font-medium hover:underline">{t("backToDiscover")}</Link>
      </div>
    );
  }

  const title = locale === "ar" ? property.title.ar : property.title.en;
  const description = locale === "ar" ? property.description.ar : property.description.en;
  const images = property.images?.length ? property.images : [{ url: "", isPrimary: true }];
  const priceLabel =
    property.purpose === "rent" && property.rentalPrice
      ? `${property.rentalPrice.toLocaleString()} ${property.currency} / ${t("month")}`
      : `${property.price.toLocaleString()} ${property.currency}`;

  return (
    <div className="min-h-[70vh] py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}/discover`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />{t("backToDiscover")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="lg:col-span-3 space-y-3">
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-muted relative">
              {images[activeImage]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[activeImage].url} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Building2 className="w-12 h-12 opacity-40" /></div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} type="button" onClick={() => setActiveImage(i)} className={`shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-colors ${i === activeImage ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                    {img.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">{tForm(`purposes.${property.purpose}` as any)}</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">{tForm(`types.${property.type}` as any)}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight leading-snug mb-2">{title}</h1>
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                {[property.location.address, property.location.district, property.location.city, property.location.country].filter(Boolean).join(" · ")}
              </p>
            </div>

            <p className="text-2xl font-semibold text-primary tracking-tight">{priceLabel}</p>

            <div className="grid grid-cols-3 gap-3">
              {property.bedrooms != null && (
                <div className="rounded-lg border border-[hsl(var(--border))] p-3 text-center">
                  <Bed className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{property.bedrooms}</p>
                  <p className="text-[11px] text-muted-foreground">{t("bedrooms")}</p>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="rounded-lg border border-[hsl(var(--border))] p-3 text-center">
                  <Bath className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{property.bathrooms}</p>
                  <p className="text-[11px] text-muted-foreground">{t("bathrooms")}</p>
                </div>
              )}
              <div className="rounded-lg border border-[hsl(var(--border))] p-3 text-center">
                <Maximize2 className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm font-medium">{property.area} m²</p>
                <p className="text-[11px] text-muted-foreground">{t("area")}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {property.furnishing && (
                <div className="flex justify-between py-2 border-b border-[hsl(var(--border))]">
                  <span className="text-muted-foreground">{t("furnishing")}</span>
                  <span className="font-medium">{tForm(`furnishingOptions.${property.furnishing}` as any) || property.furnishing}</span>
                </div>
              )}
              {property.yearBuilt && (
                <div className="flex justify-between py-2 border-b border-[hsl(var(--border))]">
                  <span className="text-muted-foreground">{t("yearBuilt")}</span>
                  <span className="font-medium">{property.yearBuilt}</span>
                </div>
              )}
              {property.floor != null && (
                <div className="flex justify-between py-2 border-b border-[hsl(var(--border))]">
                  <span className="text-muted-foreground">{t("floor")}</span>
                  <span className="font-medium">{property.floor}{property.totalFloors ? ` / ${property.totalFloors}` : ""}</span>
                </div>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <button type="button" className="w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-[hsl(var(--primary-600))] transition-colors">{t("contactAgent")}</button>
              <button type="button" className="w-full h-11 rounded-md border border-[hsl(var(--border))] text-sm font-medium hover:bg-muted transition-colors">{t("scheduleVisit")}</button>
            </div>
          </div>
        </div>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-lg font-semibold mb-3">{t("description")}</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{description}</p>
        </section>

        {property.amenities?.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-3">{t("amenities")}</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((a) => (
                <span key={a} className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-foreground">{a}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
