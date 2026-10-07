"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Bed, Bath, Maximize2, MapPin } from "lucide-react";

export interface PropertyCardData {
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
  location: { city: string; district?: string };
  images: { url: string; isPrimary?: boolean }[];
  isFeatured?: boolean;
}

interface PropertyCardProps {
  property: PropertyCardData;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const locale = useLocale();
  const t = useTranslations("Discover");
  const tForm = useTranslations("Listings.form");

  const title = locale === "ar" ? property.title.ar : property.title.en;
  const primaryImage =
    property.images?.find((i) => i.isPrimary)?.url || property.images?.[0]?.url;

  const priceLabel =
    property.purpose === "rent" && property.rentalPrice
      ? `${property.rentalPrice.toLocaleString()} ${property.currency}/${t("month")}`
      : `${property.price.toLocaleString()} ${property.currency}`;

  return (
    <Link
      href={`/${locale}/properties/${property._id}`}
      className="group block rounded-xl border border-[hsl(var(--border))] bg-card overflow-hidden transition-all hover:shadow-lg hover:border-[hsl(var(--primary-300))]"
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={primaryImage} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">{t("noImage")}</div>
        )}
        <div className="absolute top-3 start-3 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/70 text-white backdrop-blur-sm">
            {tForm(`purposes.${property.purpose}` as any) || property.purpose}
          </span>
          {property.isFeatured && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary text-primary-foreground">{t("featured")}</span>
          )}
        </div>
      </div>
      <div className="p-4 space-y-2.5">
        <div>
          <h3 className="font-semibold text-[15px] leading-snug line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{property.location.city}{property.location.district ? ` · ${property.location.district}` : ""}</span>
          </p>
        </div>
        <p className="text-base font-semibold tracking-tight text-primary">{priceLabel}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
          {property.bedrooms != null && (
            <span className="inline-flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{property.bedrooms}</span>
          )}
          {property.bathrooms != null && (
            <span className="inline-flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{property.bathrooms}</span>
          )}
          <span className="inline-flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{property.area} m²</span>
          <span className="ms-auto text-[11px] opacity-80">{tForm(`types.${property.type}` as any) || property.type}</span>
        </div>
      </div>
    </Link>
  );
}
