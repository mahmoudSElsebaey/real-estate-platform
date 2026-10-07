import brandConfig from "@/config/brand.config";

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (envUrl) return envUrl;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function defaultOpenGraph(locale: string) {
  const description =
    locale === "ar"
      ? brandConfig.description.ar
      : brandConfig.description.en;

  return {
    type: "website" as const,
    siteName: brandConfig.brandName,
    title: brandConfig.brandName,
    description,
    url: absoluteUrl(`/${locale}`),
    locale: locale === "ar" ? "ar_EG" : "en_US",
    images: [
      {
        url: absoluteUrl(brandConfig.logo.ogImage),
        width: 1200,
        height: 630,
        alt: brandConfig.brandName,
      },
    ],
  };
}
