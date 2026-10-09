"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ExternalLink, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { PROPERTY_STATUS, PROPERTY_TYPES, LISTING_PURPOSE } from "@/lib/properties/constants";

interface AdminProperty {
  _id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  type: string;
  purpose: string;
  status: string;
  price: number;
  rentalPrice?: number | null;
  currency: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  location: { city: string; district?: string; address?: string; country?: string };
  images?: { url: string; publicId?: string; isPrimary?: boolean; order?: number; alt?: string }[];
  rejectionReason?: string;
  updatedAt: string;
  owner?: { name: string; email: string };
  isFeatured?: boolean;
}

const STATUS_LABELS: Record<string, { ar: string; en: string }> = {
  draft: { ar: "مسودة", en: "Draft" },
  pending: { ar: "بانتظار المراجعة", en: "Pending review" },
  approved: { ar: "تمت الموافقة", en: "Approved" },
  rejected: { ar: "مرفوض", en: "Rejected" },
  published: { ar: "منشور", en: "Published" },
  suspended: { ar: "موقوف", en: "Suspended" },
  archived: { ar: "مؤرشف / محذوف", en: "Archived" },
};

const TYPE_LABELS: Record<string, { ar: string; en: string }> = {
  apartment: { ar: "شقة", en: "Apartment" }, villa: { ar: "فيلا", en: "Villa" },
  townhouse: { ar: "تاون هاوس", en: "Townhouse" }, penthouse: { ar: "بنتهاوس", en: "Penthouse" },
  studio: { ar: "استوديو", en: "Studio" }, duplex: { ar: "دوبلكس", en: "Duplex" },
  chalet: { ar: "شاليه", en: "Chalet" }, office: { ar: "مكتب", en: "Office" },
  retail: { ar: "محل تجاري", en: "Retail" }, land: { ar: "أرض", en: "Land" },
  hotel: { ar: "فندق", en: "Hotel" }, resort: { ar: "منتجع", en: "Resort" },
  other: { ar: "أخرى", en: "Other" },
};
const PURPOSE_LABELS: Record<string, { ar: string; en: string }> = {
  sale: { ar: "للبيع", en: "For sale" }, rent: { ar: "للإيجار", en: "For rent" },
  invest: { ar: "للاستثمار", en: "Investment" }, both: { ar: "بيع أو إيجار", en: "Sale or rent" },
};

type EditForm = {
  titleEn: string; titleAr: string; descriptionEn: string; descriptionAr: string;
  type: string; purpose: string; status: string; price: string; rentalPrice: string;
  currency: string; area: string; bedrooms: string; bathrooms: string;
  city: string; district: string; address: string; country: string;
  imagesText: string; isFeatured: boolean;
};

function formFromProperty(p: AdminProperty): EditForm {
  return {
    titleEn: p.title?.en || "", titleAr: p.title?.ar || "",
    descriptionEn: p.description?.en || "", descriptionAr: p.description?.ar || "",
    type: p.type || "apartment", purpose: p.purpose || "sale", status: p.status || "draft",
    price: String(p.price ?? 0), rentalPrice: p.rentalPrice == null ? "" : String(p.rentalPrice),
    currency: p.currency || "EGP", area: String(p.area ?? 1),
    bedrooms: p.bedrooms == null ? "" : String(p.bedrooms),
    bathrooms: p.bathrooms == null ? "" : String(p.bathrooms),
    city: p.location?.city || "", district: p.location?.district || "",
    address: p.location?.address || "", country: p.location?.country || "Egypt",
    imagesText: (p.images || []).map((image) => image.url).join("\n"),
    isFeatured: Boolean(p.isFeatured),
  };
}

export default function AdminPropertiesPage() {
  const t = useTranslations("Moderation");
  const locale = useLocale();
  const router = useRouter();
  const isAr = locale === "ar";
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminProperty | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);

  const copy = {
    title: isAr ? "إدارة جميع العقارات" : "Manage all properties",
    subtitle: isAr ? "عرض وإضافة وتعديل وحذف العقارات المنشورة والمعلقة وباقي الحالات." : "View, add, edit, and remove published, pending, and other properties.",
    add: isAr ? "إضافة عقار" : "Add property",
    search: isAr ? "ابحث بالاسم أو المدينة..." : "Search by title or city...",
    all: isAr ? "كل الحالات" : "All statuses",
    refresh: isAr ? "تحديث" : "Refresh",
    edit: isAr ? "تعديل" : "Edit",
    delete: isAr ? "حذف" : "Delete",
    open: isAr ? "عرض الموقع" : "View listing",
    owner: isAr ? "المالك" : "Owner",
    noResults: isAr ? "لا توجد عقارات مطابقة للبحث." : "No matching properties found.",
    loading: isAr ? "جارٍ تحميل العقارات..." : "Loading properties...",
    page: isAr ? "صفحة" : "Page",
    of: isAr ? "من" : "of",
    previous: isAr ? "السابق" : "Previous",
    next: isAr ? "التالي" : "Next",
    save: isAr ? "حفظ التعديلات" : "Save changes",
    cancel: isAr ? "إلغاء" : "Cancel",
    editTitle: isAr ? "تعديل بيانات العقار" : "Edit property",
    titleAr: isAr ? "اسم العقار بالعربية" : "Arabic title",
    titleEn: isAr ? "اسم العقار بالإنجليزية" : "English title",
    descAr: isAr ? "الوصف بالعربية" : "Arabic description",
    descEn: isAr ? "الوصف بالإنجليزية" : "English description",
    type: isAr ? "نوع العقار" : "Property type",
    purpose: isAr ? "الغرض" : "Purpose",
    status: isAr ? "الحالة" : "Status",
    price: isAr ? "السعر" : "Price",
    rentPrice: isAr ? "سعر الإيجار (اختياري)" : "Rental price (optional)",
    currency: isAr ? "العملة" : "Currency",
    area: isAr ? "المساحة (م²)" : "Area (m²)",
    bedrooms: isAr ? "غرف النوم" : "Bedrooms",
    bathrooms: isAr ? "الحمامات" : "Bathrooms",
    city: isAr ? "المدينة" : "City",
    district: isAr ? "الحي" : "District",
    address: isAr ? "العنوان" : "Address",
    country: isAr ? "الدولة" : "Country",
    images: isAr ? "روابط الصور (كل رابط في سطر)" : "Image URLs (one per line)",
    featured: isAr ? "عقار مميز" : "Featured property",
    confirmDelete: isAr ? "هل تريد أرشفة هذا العقار وإخفاءه من الموقع؟" : "Archive this property and hide it from the public site?",
    saved: isAr ? "تم حفظ التعديلات." : "Changes saved.",
    deleted: isAr ? "تمت أرشفة العقار وإخفاؤه من الموقع." : "Property archived and hidden from the public site.",
    loadError: isAr ? "تعذر تحميل العقارات." : "Could not load properties.",
    saveError: isAr ? "تعذر حفظ التعديلات. راجع البيانات وحاول مرة أخرى." : "Could not save changes. Check the fields and try again.",
    deleteError: isAr ? "تعذر حذف العقار." : "Could not remove property.",
    noOwner: isAr ? "غير محدد" : "Unknown",
    featuredBadge: isAr ? "مميز" : "Featured",
    searchButton: isAr ? "بحث" : "Search",
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      if (status) params.set("status", status);
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/admin/properties?${params.toString()}`);
      if (res.status === 401) { router.push(`/${locale}/login`); return; }
      if (res.status === 403) { setError(t("forbidden")); setProperties([]); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setProperties(data.properties || []);
      setPages(data.pagination?.pages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      setError(copy.loadError);
    } finally {
      setLoading(false);
    }
  }, [status, q, page, locale, router, t, isAr]);

  useEffect(() => { load(); }, [load]);

  function updateField<K extends keyof EditForm>(key: K, value: EditForm[K]) {
    setForm((old) => old ? { ...old, [key]: value } : old);
  }

  function startEditing(property: AdminProperty) {
    setEditing(property);
    setForm(formFromProperty(property));
    setError("");
    setNotice("");
  }

  async function saveProperty(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing || !form) return;
    setUpdating(editing._id);
    setError("");
    setNotice("");
    try {
      const images = form.imagesText.split("\n").map((url) => url.trim()).filter(Boolean).map((url, index) => ({
        url, isPrimary: index === 0, order: index,
      }));
      const body = {
        title: { en: form.titleEn.trim(), ar: form.titleAr.trim() },
        description: { en: form.descriptionEn.trim(), ar: form.descriptionAr.trim() },
        type: form.type, purpose: form.purpose, status: form.status,
        price: Number(form.price), rentalPrice: form.rentalPrice === "" ? null : Number(form.rentalPrice),
        currency: form.currency.trim() || "EGP", area: Number(form.area),
        bedrooms: form.bedrooms === "" ? null : Number(form.bedrooms),
        bathrooms: form.bathrooms === "" ? null : Number(form.bathrooms),
        location: {
          city: form.city.trim(), district: form.district.trim(), address: form.address.trim(),
          country: form.country.trim() || "Egypt",
        },
        images, isFeatured: form.isFeatured,
      };
      const res = await fetch(`/api/properties/${editing._id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setEditing(null);
      setForm(null);
      setNotice(copy.saved);
      await load();
    } catch {
      setError(copy.saveError);
    } finally {
      setUpdating(null);
    }
  }

  async function archiveProperty(property: AdminProperty) {
    const title = isAr ? property.title?.ar : property.title?.en;
    if (!window.confirm(`${copy.confirmDelete}\n\n${title || property._id}`)) return;
    setUpdating(property._id);
    setError("");
    setNotice("");
    try {
      const res = await fetch(`/api/properties/${property._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setNotice(copy.deleted);
      await load();
    } catch {
      setError(copy.deleteError);
    } finally {
      setUpdating(null);
    }
  }

  const inputClass = "w-full min-w-0 rounded-lg border border-[hsl(var(--input))] bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "mb-1.5 block text-sm font-medium text-foreground";
  const statusName = (value: string) => STATUS_LABELS[value]?.[isAr ? "ar" : "en"] || value;
  const money = (value: number, currency: string) => `${Number(value || 0).toLocaleString(isAr ? "ar-EG" : "en-US")} ${currency || "EGP"}`;

  return (
    <div className="min-h-[70vh] py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight md:text-3xl">
              <Building2 className="h-7 w-7 text-primary" />{copy.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{copy.subtitle}</p>
            <p className="mt-2 text-sm font-medium">{isAr ? "إجمالي العقارات:" : "Total properties:"} {total}</p>
          </div>
          <Link href={`/${locale}/listings/new`} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">
            <Plus className="h-4 w-4" />{copy.add}
          </Link>
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border border-[hsl(var(--border))] bg-card p-4 md:grid-cols-[220px_minmax(0,1fr)_auto_auto]">
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={inputClass} aria-label={copy.status}>
            <option value="">{copy.all}</option>
            {PROPERTY_STATUS.map((s) => <option key={s} value={s}>{statusName(s)}</option>)}
          </select>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setPage(1); load(); }}>
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={copy.search} className={`${inputClass} ps-10`} />
            </div>
            <button type="submit" className="rounded-lg border border-[hsl(var(--border))] px-4 text-sm font-medium hover:bg-muted">{copy.searchButton}</button>
          </form>
          <button type="button" onClick={() => load()} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[hsl(var(--border))] px-4 text-sm font-medium hover:bg-muted"><RefreshCw className="h-4 w-4" />{copy.refresh}</button>
          <Link href={`/${locale}/listings/new`} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[hsl(var(--border))] px-4 text-sm font-medium hover:bg-muted"><Plus className="h-4 w-4" />{copy.add}</Link>
        </div>

        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {notice && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}

        {loading ? (
          <div className="rounded-2xl border border-[hsl(var(--border))] py-16 text-center text-muted-foreground">{copy.loading}</div>
        ) : properties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] py-16 text-center text-muted-foreground">{copy.noResults}</div>
        ) : (
          <div className="space-y-4">
            {properties.map((p) => {
              const title = (isAr ? p.title?.ar : p.title?.en) || p.title?.en || p.title?.ar || (isAr ? "بدون عنوان" : "Untitled property");
              const image = p.images?.find((item) => item.isPrimary)?.url || p.images?.[0]?.url;
              return (
                <article key={p._id} className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-card shadow-sm">
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                    {image ? <img src={image} alt={title} className="h-28 w-full rounded-xl object-cover sm:w-40" /> : <div className="flex h-28 w-full items-center justify-center rounded-xl bg-muted text-muted-foreground sm:w-40"><Building2 className="h-8 w-8" /></div>}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{statusName(p.status)}</span>
                        {p.isFeatured && <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700">{copy.featuredBadge}</span>}
                        <span className="text-xs text-muted-foreground">{TYPE_LABELS[p.type]?.[isAr ? "ar" : "en"] || p.type} · {PURPOSE_LABELS[p.purpose]?.[isAr ? "ar" : "en"] || p.purpose}</span>
                      </div>
                      <h2 className="truncate text-lg font-semibold">{title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{[p.location?.city, p.location?.district].filter(Boolean).join(" · ")}</p>
                      <p className="mt-2 text-sm font-medium">{money(p.price, p.currency)}{p.rentalPrice ? ` · ${isAr ? "الإيجار" : "Rent"}: ${money(p.rentalPrice, p.currency)}` : ""} · {Number(p.area || 0).toLocaleString()} {isAr ? "م²" : "m²"}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{copy.owner}: {p.owner?.name || copy.noOwner}{p.owner?.email ? ` · ${p.owner.email}` : ""}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2 sm:max-w-44 sm:justify-end">
                      <button type="button" onClick={() => startEditing(p)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[hsl(var(--border))] px-3 text-sm font-medium hover:bg-muted"><Pencil className="h-4 w-4" />{copy.edit}</button>
                      <button type="button" disabled={updating === p._id || p.status === "archived"} onClick={() => archiveProperty(p)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"><Trash2 className="h-4 w-4" />{copy.delete}</button>
                      <Link href={`/${locale}/properties/${p._id}`} target="_blank" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[hsl(var(--border))] px-3 text-sm font-medium hover:bg-muted"><ExternalLink className="h-4 w-4" />{copy.open}</Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && pages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-[hsl(var(--border))] bg-card p-3">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm disabled:opacity-40">{copy.previous}</button>
            <span className="text-sm text-muted-foreground">{copy.page} {page} {copy.of} {pages}</span>
            <button type="button" disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))} className="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm disabled:opacity-40">{copy.next}</button>
          </div>
        )}
      </div>

      {editing && form && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-3 py-8 sm:p-6" role="dialog" aria-modal="true" aria-label={copy.editTitle}>
          <form onSubmit={saveProperty} className="w-full max-w-4xl rounded-2xl border border-[hsl(var(--border))] bg-background shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-[hsl(var(--border))] bg-background px-5 py-4">
              <div><h2 className="text-lg font-semibold">{copy.editTitle}</h2><p className="text-xs text-muted-foreground">{editing._id}</p></div>
              <button type="button" onClick={() => { setEditing(null); setForm(null); }} className="rounded-lg p-2 hover:bg-muted" aria-label={copy.cancel}><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {([
                ["titleAr", copy.titleAr, "text"], ["titleEn", copy.titleEn, "text"],
              ] as const).map(([key, label]) => <label key={key}><span className={labelClass}>{label}</span><input required minLength={5} maxLength={200} value={form[key]} onChange={(e) => updateField(key, e.target.value)} className={inputClass} /></label>)}
              <label className="sm:col-span-2"><span className={labelClass}>{copy.descAr}</span><textarea required minLength={20} maxLength={5000} rows={3} value={form.descriptionAr} onChange={(e) => updateField("descriptionAr", e.target.value)} className={inputClass} /></label>
              <label className="sm:col-span-2"><span className={labelClass}>{copy.descEn}</span><textarea required minLength={20} maxLength={5000} rows={3} value={form.descriptionEn} onChange={(e) => updateField("descriptionEn", e.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>{copy.type}</span><select value={form.type} onChange={(e) => updateField("type", e.target.value)} className={inputClass}>{PROPERTY_TYPES.map((v) => <option key={v} value={v}>{TYPE_LABELS[v]?.[isAr ? "ar" : "en"] || v}</option>)}</select></label>
              <label><span className={labelClass}>{copy.purpose}</span><select value={form.purpose} onChange={(e) => updateField("purpose", e.target.value)} className={inputClass}>{LISTING_PURPOSE.map((v) => <option key={v} value={v}>{PURPOSE_LABELS[v]?.[isAr ? "ar" : "en"] || v}</option>)}</select></label>
              <label><span className={labelClass}>{copy.status}</span><select value={form.status} onChange={(e) => updateField("status", e.target.value)} className={inputClass}>{PROPERTY_STATUS.map((v) => <option key={v} value={v}>{statusName(v)}</option>)}</select></label>
              <label><span className={labelClass}>{copy.currency}</span><select value={form.currency} onChange={(e) => updateField("currency", e.target.value)} className={inputClass}>{["EGP", "USD", "AED", "SAR", "GBP", "EUR"].map((v) => <option key={v}>{v}</option>)}</select></label>
              <label><span className={labelClass}>{copy.price}</span><input required type="number" min="0" step="any" value={form.price} onChange={(e) => updateField("price", e.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>{copy.rentPrice}</span><input type="number" min="0" step="any" value={form.rentalPrice} onChange={(e) => updateField("rentalPrice", e.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>{copy.area}</span><input required type="number" min="1" step="any" value={form.area} onChange={(e) => updateField("area", e.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>{copy.bedrooms}</span><input type="number" min="0" step="1" value={form.bedrooms} onChange={(e) => updateField("bedrooms", e.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>{copy.bathrooms}</span><input type="number" min="0" step="1" value={form.bathrooms} onChange={(e) => updateField("bathrooms", e.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>{copy.city}</span><input required minLength={2} value={form.city} onChange={(e) => updateField("city", e.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>{copy.district}</span><input value={form.district} onChange={(e) => updateField("district", e.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>{copy.address}</span><input value={form.address} onChange={(e) => updateField("address", e.target.value)} className={inputClass} /></label>
              <label><span className={labelClass}>{copy.country}</span><input value={form.country} onChange={(e) => updateField("country", e.target.value)} className={inputClass} /></label>
              <label className="sm:col-span-2"><span className={labelClass}>{copy.images}</span><textarea rows={4} value={form.imagesText} onChange={(e) => updateField("imagesText", e.target.value)} placeholder="https://..." className={inputClass} /></label>
              <label className="flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] p-3 sm:col-span-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => updateField("isFeatured", e.target.checked)} className="h-4 w-4 accent-primary" /><span className="text-sm font-medium">{copy.featured}</span></label>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-[hsl(var(--border))] p-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => { setEditing(null); setForm(null); }} className="h-11 rounded-lg border border-[hsl(var(--border))] px-5 text-sm font-medium hover:bg-muted">{copy.cancel}</button>
              <button type="submit" disabled={updating === editing._id} className="h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{updating === editing._id ? "..." : copy.save}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
