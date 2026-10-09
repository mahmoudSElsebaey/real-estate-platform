"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Search } from "lucide-react";
import { PROPERTY_STATUS } from "@/lib/properties/constants";

interface AdminProperty {
  _id: string;
  title: { en: string; ar: string };
  type: string;
  purpose: string;
  status: string;
  price: number;
  rentalPrice?: number;
  currency: string;
  location: { city: string; country?: string };
  rejectionReason?: string;
  updatedAt: string;
  owner?: { name: string; email: string };
}

export default function AdminPropertiesPage() {
  const t = useTranslations("Moderation");
  const tList = useTranslations("Listings");
  const locale = useLocale();
  const router = useRouter();

  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [status, setStatus] = useState("pending");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (q) params.set("q", q);
      const res = await fetch(`/api/admin/properties?${params.toString()}`);
      if (res.status === 401) { router.push(`/${locale}/login`); return; }
      if (res.status === 403) { setError(t("forbidden")); setProperties([]); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setProperties(data.properties || []);
    } catch { setError(t("error")); }
    finally { setLoading(false); }
  }, [status, q, locale, router, t]);

  useEffect(() => { load(); }, [load]);

  async function setPropertyStatus(id: string, nextStatus: string, reason?: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, rejectionReason: reason || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || t("error")); return; }
      setRejectId(null);
      setRejectReason("");
      await load();
    } catch { setError(t("error")); }
    finally { setUpdating(null); }
  }

  const inputClass = "h-10 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />{t("title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} sm:w-44`}>
            <option value="">{t("allStatuses")}</option>
            {PROPERTY_STATUS.map((s) => (
              <option key={s} value={s}>{tList(`status.${s}` as any) || s}</option>
            ))}
          </select>
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} placeholder={t("searchPlaceholder")} className={`${inputClass} w-full ps-10`} />
          </div>
          <button type="button" onClick={() => load()} className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-[hsl(var(--primary-600))] transition-colors">{t("refresh")}</button>
        </div>

        {error && <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[hsl(var(--border))] rounded-xl">
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((p) => {
              const title = locale === "ar" ? p.title?.ar : p.title?.en;
              return (
                <div key={p._id} className="rounded-xl border border-[hsl(var(--border))] bg-card p-5 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <Link href={`/${locale}/properties/${p._id}`} className="font-medium hover:text-primary">{title}</Link>
                      <p className="text-xs text-muted-foreground mt-1">{p.location?.city}{p.owner ? ` · ${p.owner.name} · ${p.owner.email}` : ""}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary">{tList(`status.${p.status}` as any) || p.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.purpose} · {p.type} · {(p.rentalPrice || p.price)?.toLocaleString()} {p.currency}</p>
                  {p.rejectionReason && <p className="text-sm text-red-600">{t("rejectionReason")}: {p.rejectionReason}</p>}
                  {rejectId === p._id ? (
                    <div className="space-y-2 pt-2 border-t border-[hsl(var(--border))]">
                      <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={2} placeholder={t("rejectionPlaceholder")} className="w-full px-3 py-2 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                      <div className="flex gap-2">
                        <button type="button" disabled={updating === p._id || !rejectReason.trim()} onClick={() => setPropertyStatus(p._id, "rejected", rejectReason)} className="h-9 px-4 rounded-md bg-red-600 text-white text-sm font-medium disabled:opacity-50">{t("confirmReject")}</button>
                        <button type="button" onClick={() => { setRejectId(null); setRejectReason(""); }} className="h-9 px-4 rounded-md border border-[hsl(var(--border))] text-sm">{t("cancel")}</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {p.status === "pending" && (
                        <>
                          <button type="button" disabled={updating === p._id} onClick={() => setPropertyStatus(p._id, "approved")} className="h-9 px-3 rounded-md bg-emerald-600 text-white text-xs font-medium disabled:opacity-50">{t("approve")}</button>
                          <button type="button" disabled={updating === p._id} onClick={() => setRejectId(p._id)} className="h-9 px-3 rounded-md bg-red-600 text-white text-xs font-medium disabled:opacity-50">{t("reject")}</button>
                        </>
                      )}
                      {(p.status === "approved" || p.status === "pending") && (
                        <button type="button" disabled={updating === p._id} onClick={() => setPropertyStatus(p._id, "published")} className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50">{t("publish")}</button>
                      )}
                      {p.status === "published" && (
                        <button type="button" disabled={updating === p._id} onClick={() => setPropertyStatus(p._id, "suspended")} className="h-9 px-3 rounded-md border border-[hsl(var(--border))] text-xs font-medium disabled:opacity-50">{t("suspend")}</button>
                      )}
                      {p.status === "suspended" && (
                        <button type="button" disabled={updating === p._id} onClick={() => setPropertyStatus(p._id, "published")} className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50">{t("publish")}</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
