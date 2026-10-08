"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ImagePlus, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROPERTY_TYPES, LISTING_PURPOSE } from "@/lib/properties/constants";
import { ImageUploader, type ImageItem } from "@/components/properties/ImageUploader";

export default function ListPropertyExperience() {
  const t = useTranslations("Listings.form");
  const locale = useLocale();
  const ar = locale === "ar";
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
    setError(""); setSuccess("");

    const validationError =
      titleEn.trim().length < 5 ? (ar ? "العنوان بالإنجليزية يجب أن يكون 5 أحرف على الأقل." : "English title must be at least 5 characters.") :
      titleAr.trim().length < 5 ? (ar ? "العنوان بالعربية يجب أن يكون 5 أحرف على الأقل." : "Arabic title must be at least 5 characters.") :
      descEn.trim().length < 20 ? (ar ? "الوصف بالإنجليزية يجب أن يكون 20 حرفًا على الأقل." : "English description must be at least 20 characters.") :
      descAr.trim().length < 20 ? (ar ? "الوصف بالعربية يجب أن يكون 20 حرفًا على الأقل." : "Arabic description must be at least 20 characters.") :
      !city.trim() || city.trim().length < 2 ? (ar ? "المدينة مطلوبة ويجب أن تكون حرفين على الأقل." : "City is required and must be at least 2 characters.") :
      !area || Number(area) < 1 ? (ar ? "المساحة يجب أن تكون أكبر من صفر." : "Area must be greater than zero.") :
      null;

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const body = {
      title: { en: titleEn, ar: titleAr },
      description: { en: descEn, ar: descAr },
      type, purpose, price: Number(price) || 0,
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
      const res = await fetch("/api/properties", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) {
        const fieldErrors = data.details?.fieldErrors
          ? Object.values(data.details.fieldErrors).flat().filter(Boolean).join(" ")
          : "";
        setError(
          data.error === "Validation failed"
            ? fieldErrors || (ar ? "راجع الحقول المطلوبة." : "Please check the required fields.")
            : data.error || "Failed"
        );
        setLoading(false); return;
      }
      setSuccess(t("successCreate"));
      setTimeout(() => { router.push(`/${locale}/listings`); router.refresh(); }, 800);
    } catch {
      setError(ar ? "حدث خطأ غير متوقع." : "Something went wrong.");
      setLoading(false);
    }
  }

  const input = "h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";
  const areaInput = "min-h-32 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden bg-neutral-950 text-white" style={{ backgroundImage: "linear-gradient(90deg,rgba(5,12,9,.92),rgba(5,12,9,.58)),url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85)", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,142,112,.28),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,.08),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-white/55"><Sparkles className="h-3.5 w-3.5" />{ar ? "بائع عقاركو" : "AQARCO LISTING STUDIO"}</p>
            <h1 className="mt-5 text-4xl font-medium tracking-[-0.04em] sm:text-6xl">{ar ? "قدّم عقارك بالطريقة التي يستحقها." : "Present your property the way it deserves."}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">{ar ? "أنشئ قائمة أنيقة، أضف الصور والتفاصيل، ثم أرسلها للمراجعة. نحن نهتم بأن تكون المعلومات واضحة وجذابة للمشتري أو المستثمر." : "Create a polished listing, add the story and details, then submit it for review. Clear information makes better property decisions."}</p>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3 text-xs text-white/60">
            {[ar ? "01 التفاصيل" : "01 DETAILS", ar ? "02 الصور" : "02 IMAGES", ar ? "03 النشر" : "03 REVIEW"].map((step, i) => <span key={step} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white">{i + 1}</span>{step}</span>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700"><Check className="h-4 w-4" />{success}</div>}

        <div className="grid gap-8 lg:grid-cols-[.32fr_.68fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">{ar ? "قائمة مميزة" : "A CURATED LISTING"}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">{ar ? "ابدأ بالقصة، ثم التفاصيل." : "Start with the story, then the details."}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{ar ? "الصورة الأولى والعنوان والموقع هي أول ما يراه العميل. اجعلها دقيقة ومقنعة." : "Your first image, title and location create the first impression. Make them precise and compelling."}</p>
            <div className="mt-7 rounded-3xl border border-border bg-muted/40 p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ImagePlus className="h-5 w-5" /></div><div><p className="text-sm font-semibold">{ar ? "حتى 12 صورة" : "Up to 12 images"}</p><p className="text-xs text-muted-foreground">{ar ? "اختر صورة رئيسية واضحة" : "Choose one strong primary image"}</p></div></div></div>
            <div className="mt-3 rounded-3xl border border-border bg-card p-5"><div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /><p className="text-sm font-medium">{ar ? "موقع واضح = قرار أسرع" : "Clear location = faster decisions"}</p></div></div>
          </aside>

          <div className="rounded-[32px] border border-border bg-card p-5 shadow-xl sm:p-8 lg:p-10">
            <div className="border-b border-border pb-7"><p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{ar ? "تفاصيل العقار" : "PROPERTY DETAILS"}</p><h2 className="mt-2 text-2xl font-semibold">{t("createTitle")}</h2></div>

            <div className="space-y-9 pt-8">
              <section>
                <h3 className="text-lg font-semibold">{ar ? "العنوان والوصف" : "Title & story"}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <input required minLength={5} value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder={t("titleEn")} className={input} />
                  <input required minLength={5} value={titleAr} onChange={e => setTitleAr(e.target.value)} placeholder={t("titleAr")} dir="rtl" className={input} />
                  <textarea required minLength={20} value={descEn} onChange={e => setDescEn(e.target.value)} placeholder={t("descEn")} className={areaInput} />
                  <textarea required minLength={20} value={descAr} onChange={e => setDescAr(e.target.value)} placeholder={t("descAr")} dir="rtl" className={areaInput} />
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold">{ar ? "نوع العرض" : "Listing type"}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <select value={type} onChange={e => setType(e.target.value)} className={input}>{PROPERTY_TYPES.map(pt => <option key={pt} value={pt}>{t(`types.${pt}` as any)}</option>)}</select>
                  <select value={purpose} onChange={e => setPurpose(e.target.value)} className={input}>{LISTING_PURPOSE.map(p => <option key={p} value={p}>{t(`purposes.${p}` as any)}</option>)}</select>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold">{ar ? "السعر والمواصفات" : "Price & specifications"}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder={t("price")} className={input} />
                  <input type="number" value={rentalPrice} onChange={e => setRentalPrice(e.target.value)} placeholder={t("rentalPrice")} className={input} />
                  <input required min={1} type="number" value={area} onChange={e => setArea(e.target.value)} placeholder={t("area")} className={input} />
                  <input type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} placeholder={t("bedrooms")} className={input} />
                  <input type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} placeholder={t("bathrooms")} className={input} />
                  <select value={furnishing} onChange={e => setFurnishing(e.target.value)} className={input}><option value="">{t("furnishing")}</option><option value="furnished">{t("furnishingOptions.furnished")}</option><option value="semi_furnished">{t("furnishingOptions.semi_furnished")}</option><option value="unfurnished">{t("furnishingOptions.unfurnished")}</option></select>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold">{ar ? "الموقع" : "Location"}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <input required minLength={2} value={city} onChange={e => setCity(e.target.value)} placeholder={t("city")} className={input} />
                  <input value={district} onChange={e => setDistrict(e.target.value)} placeholder={t("district")} className={input} />
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder={t("address")} className={input} />
                </div>
              </section>

              <section>
                <div className="flex items-end justify-between gap-4"><div><h3 className="text-lg font-semibold">{t("images")}</h3><p className="mt-1 text-sm text-muted-foreground">{t("imagesHelp")}</p></div></div>
                <div className="mt-4 rounded-3xl border border-dashed border-border bg-muted/20 p-4 sm:p-6"><ImageUploader images={images} onChange={setImages} /></div>
              </section>

              <div className="flex flex-col gap-3 border-t border-border pt-7 sm:flex-row">
                <Button type="button" disabled={loading} onClick={() => handleSubmit("draft")} className="h-12 rounded-2xl px-6">{loading ? "..." : t("saveDraft")}</Button>
                <Button type="button" variant="secondary" disabled={loading} onClick={() => handleSubmit("pending")} className="h-12 rounded-2xl px-6">{loading ? "..." : t("submitReview")}</Button>
                <Link href={`/${locale}/listings`} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border px-6 text-sm font-medium transition hover:bg-muted">{ar ? "إلغاء" : "Cancel"}{ar ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
