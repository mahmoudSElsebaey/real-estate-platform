import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.careers" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: absoluteUrl(`/${locale}/careers`), languages: { en: absoluteUrl("/en/careers"), ar: absoluteUrl("/ar/careers") } },
  };
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages.careers");
  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">{t("title")}</h1>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>{t("intro")}</p>
          <p>{t("body1")}</p>
          <p>{t("body2")}</p>
        </div>
      </div>
    </div>
  );
}
