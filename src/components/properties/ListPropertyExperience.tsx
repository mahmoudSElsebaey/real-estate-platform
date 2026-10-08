"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROPERTY_TYPES, LISTING_PURPOSE } from "@/lib/properties/constants";
import { ImageUploader, type ImageItem } from "@/components/properties/ImageUploader";

export default function ListPropertyExperience() {
  const t = useTranslations("Listings.form");
  const locale = useLocale();
  const ar = locale === "ar";
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  const steps = [
    { id: 1, title: ar ? "الأساسيات" : "Essentials", subtitle: ar ? "العنوان والقصة" : "Title & story" },
    { id: 2, title: ar ? "التفاصيل" : "Details", subtitle: ar ? "السعر والموقع" : "Price & location" },
    { id: 3, title: ar ? "الصور والمراجعة" : "Media & review", subtitle: ar ? "جهّز للإرسال" : "Ready to submit" },
  ];

  const input = "h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";
  const inputError = "border-red-400 focus:border-red-500 focus:ring-red-500/10";
  const areaInput = "min-h-32 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

  function setField(name: string, value: string, setter: (v: string) => void) {
    setter(value);
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: "" }));
    setError("");
  }

  function validateStep(targetStep: number) {
    const next: Record<string, string> = {};
    const required = ar ? "هذا الحقل مطلوب." : "This field is required.";

    if (targetStep === 1) {
      if (titleEn.trim().length < 5) next.titleEn = ar ? "العنوان بالإنجليزية يجب أن يكون 5 أحرف على الأقل." : "English title must be at least 5 characters.";
      if (titleAr.trim().length < 5) next.titleAr = ar ? "العنوان بالعربية يجب أن يكون 5 أحرف على الأقل." : "Arabic title must be at least 5 characters.";
      if (descEn.trim().length < 20) next.descEn = ar ? "الوصف بالإنجليزية يجب أن يكون 20 حرفًا على الأقل." : "English description must be at least 20 characters.";
      if (descAr.trim().length < 20) next.descAr = ar ? "الوصف بالعربية يجب أن يكون 20 حرفًا على الأقل." : "Arabic description must be at least 20 characters.";
    }

    if (targetStep === 2) {
      if (!price || Number(price) < 0) next.price = required;
      if (!area || Number(area) < 1) next.area = ar ? "المساحة يجب أن تكون أكبر من صفر." : "Area must be greater than zero.";
      if (!city.trim() || city.trim().length < 2) next.city = ar ? "المدينة مطلوبة ويجب أن تكون حرفين على الأقل." : "City is required and must be at least 2 characters.";
      if (purpose === "rent" && (!rentalPrice || Number(rentalPrice) < 0)) next.rentalPrice = ar ? "سعر الإيجار مطلوب." : "Rental price is required.";
    }

    if (targetStep === 3) {
      if (!images.length) next.images = ar ? "أضف صورة واحدة على الأقل للعقار." : "Add at least one property image.";
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  function nextStep() {
    setError("");
    if (validateStep(step)) setStep(value => Math.min(3, value + 1));
  }

  function previousStep() {
    setError("");
    setFieldErrors({});
    setStep(value => Math.max(1, value - 1));
  }

  async function handleSubmit(status: "draft" | "pending") {
    setError("");
    setSuccess("");
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      const firstInvalid = !validateStep(1) ? 1 : !validateStep(2) ? 2 : 3;
      setStep(firstInvalid);
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
        const backendErrors = data.details?.fieldErrors || {};
        const mapped: Record<string, string> = {};
        Object.entries(backendErrors).forEach(([key, value]) => {
          const message = Array.isArray(value) ? value.filter(Boolean).join(" ") : String(value);
          if (message) mapped[key] = message;
        });
        setFieldErrors(mapped);
        setError(data.error === "Validation failed"
          ? (ar ? "راجع الحقول المحددة باللون الأحمر." : "Please review the fields highlighted in red.")
          : data.error || (ar ? "تعذر حفظ العقار." : "Failed to save property."));
        setLoading(false);
        return;
      }

      setSuccess(t("successCreate"));
      setTimeout(() => { router.push(`/${locale}/listings`); router.refresh(); }, 900);
    } catch {
      setError(ar ? "حدث خطأ غير متوقع." : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-neutral-950 text-white" style={{ backgroundImage: "linear-gradient(90deg,rgba(5,12,9,.92),rgba(5,12,9,.58)),url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85)", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,142,112,.28),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,.08),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pb-16">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-white/55"><Sparkles className="h-3.5 w-3.5" />{ar ? "استوديو إضافة العقارات" : "AQARCO LISTING STUDIO"}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-medium tracking-[-0.04em] sm:text-6xl">{ar ? "أضف عقارك بخطوات بسيطة واحترافية." : "List your property in three effortless steps."}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">{ar ? "أكمل كل مرحلة، وسنخبرك بأي خطأ في مكانه مباشرة قبل الانتقال للمرحلة التالية." : "Complete each stage and get clear inline feedback before moving forward."}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 overflow-hidden rounded-[28px] border border-border bg-card p-4 shadow-lg sm:p-6">
          <div className="relative mx-auto flex max-w-4xl items-start justify-between">
            <div className="absolute start-[8%] end-[8%] top-6 h-px bg-border" />
            <div className="absolute start-[8%] top-6 h-px bg-primary transition-all duration-700 ease-out" style={{ width: `${((step - 1) / 2) * 84}%` }} />
            {steps.map(item => {
              const active = step === item.id;
              const complete = step > item.id;
              return (
                <button key={item.id} type="button" onClick={() => item.id < step && setStep(item.id)} className="relative z-10 flex w-1/3 flex-col items-center text-center disabled:cursor-default" disabled={item.id > step}>
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-card text-sm font-bold transition-all duration-500 ${complete ? "bg-primary text-primary-foreground shadow-[0_0_0_5px_rgba(60,100,80,.10)]" : active ? "bg-foreground text-background shadow-[0_0_0_6px_rgba(60,100,80,.12)] scale-105" : "bg-muted text-muted-foreground"}`}>
                    {complete ? <Check className="h-5 w-5" /> : item.id}
                  </span>
                  <span className={`mt-3 text-xs font-bold sm:text-sm ${active ? "text-foreground" : complete ? "text-primary" : "text-muted-foreground"}`}>{item.title}</span>
                  <span className="mt-1 hidden text-[11px] text-muted-foreground sm:block">{item.subtitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700" role="alert">{error}</div>}
        {success && <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700"><Check className="h-4 w-4" />{success}</div>}

        <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-xl">
          <div className="border-b border-border px-5 py-5 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{ar ? `المرحلة 0${step} من 03` : `STEP 0${step} OF 03`}</p>
            <h2 className="mt-2 text-2xl font-semibold">{steps[step - 1].title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{steps[step - 1].subtitle}</p>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            {step === 1 && (
              <div className="space-y-7 animate-in fade-in slide-in-from-end-2 duration-500">
                <div>
                  <h3 className="text-lg font-semibold">{ar ? "العنوان والوصف" : "Title & story"}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{ar ? "اكتب معلومات واضحة بالعربية والإنجليزية." : "Give buyers a clear story in both languages."}</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><input value={titleEn} onChange={e => setField("titleEn", e.target.value, setTitleEn)} placeholder={t("titleEn")} className={`${input} ${fieldErrors.titleEn ? inputError : ""}`} />{fieldErrors.titleEn && <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.titleEn}</p>}</div>
                  <div><input value={titleAr} onChange={e => setField("titleAr", e.target.value, setTitleAr)} placeholder={t("titleAr")} dir="rtl" className={`${input} ${fieldErrors.titleAr ? inputError : ""}`} />{fieldErrors.titleAr && <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.titleAr}</p>}</div>
                  <div><textarea value={descEn} onChange={e => setField("descEn", e.target.value, setDescEn)} placeholder={t("descEn")} className={`${areaInput} ${fieldErrors.descEn ? inputError : ""}`} />{fieldErrors.descEn && <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.descEn}</p>}</div>
                  <div><textarea value={descAr} onChange={e => setField("descAr", e.target.value, setDescAr)} placeholder={t("descAr")} dir="rtl" className={`${areaInput} ${fieldErrors.descAr ? inputError : ""}`} />{fieldErrors.descAr && <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.descAr}</p>}</div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-end-2 duration-500">
                <div><h3 className="text-lg font-semibold">{ar ? "نوع العرض والسعر" : "Listing & pricing"}</h3><p className="mt-1 text-sm text-muted-foreground">{ar ? "حدد طريقة عرض العقار وقيمته ومواصفاته." : "Define how the property is offered, priced and described."}</p></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><label className="mb-2 block text-xs font-semibold text-muted-foreground">{ar ? "نوع العقار" : "Property type"}</label><select value={type} onChange={e => setType(e.target.value)} className={input}>{PROPERTY_TYPES.map(pt => <option key={pt} value={pt}>{t(`types.${pt}` as any)}</option>)}</select></div>
                  <div><label className="mb-2 block text-xs font-semibold text-muted-foreground">{ar ? "الغرض" : "Purpose"}</label><select value={purpose} onChange={e => setPurpose(e.target.value)} className={input}>{LISTING_PURPOSE.map(p => <option key={p} value={p}>{t(`purposes.${p}` as any)}</option>)}</select></div>
                  <div><input type="number" value={price} onChange={e => setField("price", e.target.value, setPrice)} placeholder={t("price")} className={`${input} ${fieldErrors.price ? inputError : ""}`} />{fieldErrors.price && <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.price}</p>}</div>
                  <div><input type="number" value={rentalPrice} onChange={e => setField("rentalPrice", e.target.value, setRentalPrice)} placeholder={t("rentalPrice")} className={`${input} ${fieldErrors.rentalPrice ? inputError : ""}`} />{fieldErrors.rentalPrice && <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.rentalPrice}</p>}</div>
                  <div><input type="number" value={area} onChange={e => setField("area", e.target.value, setArea)} placeholder={t("area")} className={`${input} ${fieldErrors.area ? inputError : ""}`} />{fieldErrors.area && <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.area}</p>}</div>
                  <input type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} placeholder={t("bedrooms")} className={input} />
                  <input type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} placeholder={t("bathrooms")} className={input} />
                  <select value={furnishing} onChange={e => setFurnishing(e.target.value)} className={input}><option value="">{t("furnishing")}</option><option value="furnished">{t("furnishingOptions.furnished")}</option><option value="semi_furnished">{t("furnishingOptions.semi_furnished")}</option><option value="unfurnished">{t("furnishingOptions.unfurnished")}</option></select>
                </div>

                <div className="border-t border-border pt-7"><h3 className="text-lg font-semibold">{ar ? "الموقع" : "Location"}</h3><div className="mt-4 grid gap-5 sm:grid-cols-3">
                  <div><input value={city} onChange={e => setField("city", e.target.value, setCity)} placeholder={t("city")} className={`${input} ${fieldErrors.city ? inputError : ""}`} />{fieldErrors.city && <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.city}</p>}</div>
                  <input value={district} onChange={e => setDistrict(e.target.value)} placeholder={t("district")} className={input} />
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder={t("address")} className={input} />
                </div></div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-end-2 duration-500">
                <div><h3 className="text-lg font-semibold">{t("images")}</h3><p className="mt-1 text-sm text-muted-foreground">{t("imagesHelp")}</p></div>
                <div className={`rounded-3xl border-2 border-dashed p-4 transition ${fieldErrors.images ? "border-red-400 bg-red-50/40" : "border-border bg-muted/20"} sm:p-6`}>
                  <ImageUploader images={images} onChange={(value) => { setImages(value); if (value.length) setFieldErrors(prev => ({ ...prev, images: "" })); }} />
                </div>
                {fieldErrors.images && <p className="text-xs font-medium text-red-600">{fieldErrors.images}</p>}

                <div className="rounded-3xl border border-border bg-muted/30 p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{ar ? "مراجعة سريعة" : "QUICK REVIEW"}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div><p className="text-xs text-muted-foreground">{ar ? "العقار" : "Property"}</p><p className="mt-1 font-semibold">{ar ? titleAr : titleEn}</p></div>
                    <div><p className="text-xs text-muted-foreground">{ar ? "الموقع" : "Location"}</p><p className="mt-1 font-semibold">{city || "—"}</p></div>
                    <div><p className="text-xs text-muted-foreground">{ar ? "الصور" : "Images"}</p><p className="mt-1 font-semibold">{images.length}</p></div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
              <div>{step > 1 ? <Button type="button" variant="ghost" onClick={previousStep} className="h-12 rounded-2xl px-5"><ArrowLeft className="h-4 w-4 rtl:rotate-180" />{ar ? "السابق" : "Back"}</Button> : <Link href={`/${locale}/listings`} className="inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-medium text-muted-foreground transition hover:bg-muted">{ar ? "إلغاء" : "Cancel"}</Link>}</div>
              {step < 3 ? <Button type="button" onClick={nextStep} className="h-12 rounded-2xl px-7 shadow-lg shadow-primary/20"><span>{ar ? "التالي" : "Continue"}</span>{ar ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}</Button> : <div className="flex flex-col gap-3 sm:flex-row"><Button type="button" disabled={loading} onClick={() => handleSubmit("draft")} variant="outline" className="h-12 rounded-2xl px-6">{loading ? "..." : t("saveDraft")}</Button><Button type="button" disabled={loading} onClick={() => handleSubmit("pending")} className="h-12 rounded-2xl px-7 shadow-lg shadow-primary/20">{loading ? "..." : t("submitReview")}<Check className="h-4 w-4" /></Button></div>}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
