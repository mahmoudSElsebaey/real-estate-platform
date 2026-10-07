"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inbox } from "lucide-react";

interface InquiryItem {
  _id: string;
  type: string;
  status: string;
  message: string;
  name: string;
  email: string;
  phone?: string;
  preferredDate?: string;
  notes?: string;
  createdAt: string;
  property?: { _id: string; title: { en: string; ar: string } };
}

const STATUS_OPTIONS = ["new", "in_progress", "contacted", "closed"] as const;

export default function InboxPage() {
  const t = useTranslations("Inquiry");
  const locale = useLocale();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/inquiries?scope=inbox");
        if (res.status === 401) { router.push(`/${locale}/login`); return; }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setInquiries(data.inquiries || []);
      } catch { setError(t("listError")); }
      finally { setLoading(false); }
    }
    load();
  }, [locale, router, t]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
      }
    } catch {}
    finally { setUpdating(null); }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">...</p></div>;

  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Inbox className="w-7 h-7 text-primary" />{t("inbox")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("inboxSubtitle")}</p>
        </div>
        {error && <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {inquiries.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[hsl(var(--border))] rounded-xl">
            <Inbox className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">{t("emptyInbox")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => {
              const propTitle = inq.property ? (locale === "ar" ? inq.property.title?.ar : inq.property.title?.en) : "—";
              return (
                <div key={inq._id} className="rounded-xl border border-[hsl(var(--border))] bg-card p-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary">{t(`types.${inq.type}` as any) || inq.type}</span>
                      <select value={inq.status} disabled={updating === inq._id} onChange={(e) => updateStatus(inq._id, e.target.value)} className="h-7 px-2 rounded-md border border-[hsl(var(--input))] bg-background text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-ring">
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{t(`status.${s}` as any)}</option>)}
                      </select>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(inq.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}</span>
                  </div>
                  {inq.property && (
                    <Link href={`/${locale}/properties/${inq.property._id}`} className="font-medium text-sm hover:text-primary block">{propTitle}</Link>
                  )}
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">{t("name")}:</span> {inq.name}</p>
                    <p><span className="text-muted-foreground">{t("email")}:</span> <a href={`mailto:${inq.email}`} className="text-primary hover:underline">{inq.email}</a></p>
                    {inq.phone && <p><span className="text-muted-foreground">{t("phone")}:</span> {inq.phone}</p>}
                  </div>
                  <p className="text-sm text-muted-foreground border-t border-[hsl(var(--border))] pt-3">{inq.message}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
