import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import brandConfig from "@/config/brand.config";
import { absoluteUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.about" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: absoluteUrl(`/${locale}/about`),
      languages: {
        en: absoluteUrl("/en/about"),
        ar: absoluteUrl("/ar/about"),
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages.about");

  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-primary mb-3">{brandConfig.shortName}</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">{t("title")}</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
          <p className="text-lg text-foreground">{t("intro")}</p>
          <p>{t("body1")}</p>
          <p>{t("body2")}</p>
          <h2 className="text-xl font-semibold text-foreground pt-4">{t("missionTitle")}</h2>
          <p>{t("mission")}</p>
          <h2 className="text-xl font-semibold text-foreground pt-4">{t("valuesTitle")}</h2>
          <ul className="list-disc ps-5 space-y-2">
            <li>{t("value1")}</li>
            <li>{t("value2")}</li>
            <li>{t("value3")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
