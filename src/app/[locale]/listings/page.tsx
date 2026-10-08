"use client";

import { useEffect, useState } from "react";
import { AccountFrame } from "@/components/account/AccountFrame";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Eye, Archive } from "lucide-react";

interface PropertyItem {
  _id: string;
  title: { en: string; ar: string };
  type: string;
  purpose: string;
  status: string;
  price: number;
  currency: string;
  area: number;
  bedrooms?: number;
  location: { city: string; district?: string };
  images: { url: string; isPrimary: boolean }[];
  createdAt: string;
}

export default function ListingsPage() {
  const t = useTranslations("Listings");
  const locale = useLocale();
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canManageListings, setCanManageListings] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch("/api/user/me");
        if (meRes.status === 401) { router.push(`/${locale}/login`); return; }
        const meData = await meRes.json();
        const allowed = ["owner", "agent", "hotel_operator", "admin"].includes(meData.user?.role || "");
        if (!allowed) { router.push(`/${locale}/dashboard`); return; }
        setCanManageListings(true);

        const res = await fetch("/api/properties?mine=true");
        if (res.status === 401) { router.push(`/${locale}/login`); return; }
        const data = await res.json();
        setProperties(data.properties || []);
      } catch { setError("Failed to load listings"); }
      finally { setLoading(false); }
    }
    load();
  }, [locale, router]);

  async function handleArchive(id: string) {
    if (!confirm("Archive this property?")) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch {}
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">...</p></div>;
  }

  return (
    <AccountFrame title={t("title")} subtitle={t("subtitle")} eyebrow="AQARCO / LISTINGS">
      {canManageListings && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link href={`/${locale}/listings/new`} className="inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium rounded-md bg-primary text-primary-foreground shadow hover:bg-[hsl(var(--primary-600))] transition-colors">
            <Plus className="w-4 h-4" />
            {t("addNew")}
          </Link>
        </div>
      )}
      {error && <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      {properties.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[hsl(var(--border))] rounded-xl">
          <p className="text-muted-foreground mb-4">{t("empty")}</p>
          {canManageListings && (
            <Link href={`/${locale}/listings/new`} className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium rounded-md bg-primary text-primary-foreground shadow hover:bg-[hsl(var(--primary-600))] transition-colors">{t("emptyCta")}</Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const primaryImage = property.images?.find((i) => i.isPrimary)?.url || property.images?.[0]?.url;
            const title = locale === "ar" ? property.title.ar : property.title.en;
            return (
              <div key={property._id} className="group rounded-xl border border-[hsl(var(--border))] bg-card overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  {primaryImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={primaryImage} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                  )}
                  <span className="absolute top-3 start-3 px-2.5 py-1 rounded-md text-xs font-medium bg-black/70 text-white">{t(`status.${property.status}` as any)}</span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{title}</h3>
                    <p className="text-sm text-muted-foreground">{property.location.city}{property.location.district ? ` · ${property.location.district}` : ""}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{property.price.toLocaleString()} {property.currency}</span>
                    <span className="text-muted-foreground">{property.area} m²{property.bedrooms != null ? ` · ${property.bedrooms} bd` : ""}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Link href={`/${locale}/listings/${property._id}/edit`} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                      <Pencil className="w-3.5 h-3.5" />{t("actions.edit")}
                    </Link>
                    {property.status === "published" && (
                      <Link href={`/${locale}/properties/${property._id}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                        <Eye className="w-3.5 h-3.5" />{t("actions.view")}
                      </Link>
                    )}
                    {property.status !== "archived" && (
                      <button onClick={() => handleArchive(property._id)} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-red-600 ms-auto">
                        <Archive className="w-3.5 h-3.5" />{t("actions.delete")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AccountFrame>
  );
}
