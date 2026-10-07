import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.privacy" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: absoluteUrl(`/${locale}/privacy`), languages: { en: absoluteUrl("/en/privacy"), ar: absoluteUrl("/ar/privacy") } },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages.privacy");
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
