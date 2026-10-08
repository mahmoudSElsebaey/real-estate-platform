"use client";

import { useEffect, useState } from "react";
import { AccountFrame } from "@/components/account/AccountFrame";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

interface InquiryItem {
  _id: string;
  type: string;
  status: string;
  message: string;
  name: string;
  email: string;
  createdAt: string;
  property?: { _id: string; title: { en: string; ar: string }; type: string; location?: { city: string } };
}

export default function InquiriesPage() {
  const t = useTranslations("Inquiry");
  const locale = useLocale();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/inquiries?scope=sent");
        if (res.status === 401) { router.push(`/${locale}/login`); return; }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setInquiries(data.inquiries || []);
      } catch { setError(t("listError")); }
      finally { setLoading(false); }
    }
    load();
  }, [locale, router, t]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">...</p></div>;

  return (
    <AccountFrame title={t("myInquiries")} subtitle={t("myInquiriesSubtitle")} eyebrow="AQARCO / REQUESTS">
      <div>
        {error && <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {inquiries.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[hsl(var(--border))] rounded-xl">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground mb-4">{t("emptySent")}</p>
            <Link href={`/${locale}/discover`} className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium rounded-md bg-primary text-primary-foreground shadow hover:bg-[hsl(var(--primary-600))] transition-colors">{t("browse")}</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => {
              const propTitle = inq.property ? (locale === "ar" ? inq.property.title?.ar : inq.property.title?.en) : "—";
              return (
                <div key={inq._id} className="rounded-xl border border-[hsl(var(--border))] bg-card p-5 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary">{t(`types.${inq.type}` as any) || inq.type}</span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground">{t(`status.${inq.status}` as any) || inq.status}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(inq.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}</span>
                  </div>
                  {inq.property && (
                    <Link href={`/${locale}/properties/${inq.property._id}`} className="font-medium text-sm hover:text-primary">{propTitle}</Link>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">{inq.message}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountFrame>
  );
}
