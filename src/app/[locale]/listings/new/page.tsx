"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PROPERTY_TYPES, LISTING_PURPOSE } from "@/lib/properties/constants";
import { ImageUploader, type ImageItem } from "@/components/properties/ImageUploader";

export default function NewPropertyPage() {
  const t = useTranslations("Listings.form");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [type, setType] = useState("apartment");
  const [purpose, setPurpose] = useState("sale");
  const [price, setPrice] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);

  async function handleSubmit(status: "draft" | "pending") {
    setError(""); setSuccess(""); setLoading(true);
    const body = {
      title: { en: titleEn, ar: titleAr },
      description: { en: descEn, ar: descAr },
      type, purpose,
      price: Number(price) || 0,
      rentalPrice: rentalPrice ? Number(rentalPrice) : null,
      area: Number(area) || 1,
      bedrooms: bedrooms ? Number(bedrooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      furnishing: furnishing || null,
      location: { city, district: district || null, address: address || null, country: "Egypt" },
      images: images.map((img, i) => ({ url: img.url, publicId: img.publicId, isPrimary: img.isPrimary || i === 0, order: i, alt: img.alt })),
      status,
    };
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "Validation failed" ? "Please check all required fields" : data.error || "Failed");
        setLoading(false);
        return;
      }
      setSuccess(t("successCreate"));
      setTimeout(() => { router.push(`/${locale}/listings`); router.refresh(); }, 800);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  const inputClass = "w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "text-sm font-medium";

  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8"><h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{t("createTitle")}</h1></div>
        {error && <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-6 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">{success}</div>}
        <div className="bg-card border border-[hsl(var(--border))] rounded-xl p-6 md:p-8 space-y-8">
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><label className={labelClass}>{t("titleEn")}</label><input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required className={inputClass} /></div>
            <div className="space-y-2"><label className={labelClass}>{t("titleAr")}</label><input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} required dir="rtl" className={inputClass} /></div>
          </section>
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><label className={labelClass}>{t("descEn")}</label><textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div className="space-y-2"><label className={labelClass}>{t("descAr")}</label><textarea value={descAr} onChange={(e) => setDescAr(e.target.value)} rows={3} dir="rtl" className="w-full px-3 py-2 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          </section>
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><label className={labelClass}>{t("type")}</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                {PROPERTY_TYPES.map((pt) => <option key={pt} value={pt}>{t(`types.${pt}` as any)}</option>)}
              </select></div>
            <div className="space-y-2"><label className={labelClass}>{t("purpose")}</label>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className={inputClass}>
                {LISTING_PURPOSE.map((p) => <option key={p} value={p}>{t(`purposes.${p}` as any)}</option>)}
              </select></div>
          </section>
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2"><label className={labelClass}>{t("price")}</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} /></div>
            <div className="space-y-2"><label className={labelClass}>{t("rentalPrice")}</label><input type="number" value={rentalPrice} onChange={(e) => setRentalPrice(e.target.value)} className={inputClass} /></div>
            <div className="space-y-2"><label className={labelClass}>{t("area")}</label><input type="number" value={area} onChange={(e) => setArea(e.target.value)} required className={inputClass} /></div>
          </section>
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2"><label className={labelClass}>{t("bedrooms")}</label><input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={inputClass} /></div>
            <div className="space-y-2"><label className={labelClass}>{t("bathrooms")}</label><input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className={inputClass} /></div>
            <div className="space-y-2"><label className={labelClass}>{t("furnishing")}</label>
              <select value={furnishing} onChange={(e) => setFurnishing(e.target.value)} className={inputClass}>
                <option value="">—</option>
                <option value="furnished">{t("furnishingOptions.furnished")}</option>
                <option value="semi_furnished">{t("furnishingOptions.semi_furnished")}</option>
                <option value="unfurnished">{t("furnishingOptions.unfurnished")}</option>
              </select></div>
          </section>
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2"><label className={labelClass}>{t("city")}</label><input value={city} onChange={(e) => setCity(e.target.value)} required className={inputClass} /></div>
            <div className="space-y-2"><label className={labelClass}>{t("district")}</label><input value={district} onChange={(e) => setDistrict(e.target.value)} className={inputClass} /></div>
            <div className="space-y-2"><label className={labelClass}>{t("address")}</label><input value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} /></div>
          </section>
          <section className="space-y-2">
            <label className={labelClass}>{t("images")}</label>
            <ImageUploader images={images} onChange={setImages} />
          </section>
          <div className="flex flex-wrap gap-3 pt-4 border-t border-[hsl(var(--border))]">
            <Button type="button" disabled={loading} onClick={() => handleSubmit("draft")}>{loading ? "..." : t("saveDraft")}</Button>
            <Button type="button" variant="secondary" disabled={loading} onClick={() => handleSubmit("pending")}>{loading ? "..." : t("submitReview")}</Button>
            <Link href={`/${locale}/listings`} className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium rounded-md border border-input bg-background shadow-sm hover:bg-muted transition-colors">{t("cancel")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
