import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import Link from "next/link";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  const categories = [
    {
      key: "buy",
      href: `/${locale}/buy`,
      title: t("categories.buy.title"),
      description: t("categories.buy.description"),
    },
    {
      key: "rent",
      href: `/${locale}/rent`,
      title: t("categories.rent.title"),
      description: t("categories.rent.description"),
    },
    {
      key: "invest",
      href: `/${locale}/invest`,
      title: t("categories.invest.title"),
      description: t("categories.invest.description"),
    },
    {
      key: "hospitality",
      href: `/${locale}/hotels`,
      title: t("categories.hospitality.title"),
      description: t("categories.hospitality.description"),
    },
  ] as const;

  return (
    <>
      <Hero />

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3">
              {t("categoriesTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={cat.href}
                className="group relative overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-card p-8 transition-all duration-300 hover:shadow-lg hover:border-[hsl(var(--primary-300))] hover:-translate-y-1"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[hsl(var(--primary-500))] to-[hsl(var(--accent-500))] opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            {t("trustTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {(["verified", "secure", "support", "transparent"] as const).map(
              (key) => (
                <div key={key} className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {t(`trustItems.${key}`)}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}
