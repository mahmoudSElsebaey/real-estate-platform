import type { Metadata } from "next";
import brandConfig from "@/config/brand.config";
import { getSiteUrl, absoluteUrl } from "@/lib/seo";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: brandConfig.brandName,
    template: `%s | ${brandConfig.brandName}`,
  },
  description: brandConfig.description.en,
  applicationName: brandConfig.brandName,
  icons: {
    icon: brandConfig.logo.favicon,
    apple: brandConfig.logo.mark,
  },
  openGraph: {
    type: "website",
    siteName: brandConfig.brandName,
    title: brandConfig.brandName,
    description: brandConfig.description.en,
    url: siteUrl,
    images: [
      {
        url: absoluteUrl(brandConfig.logo.ogImage),
        width: 1200,
        height: 630,
        alt: brandConfig.brandName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: brandConfig.brandName,
    description: brandConfig.description.en,
    images: [absoluteUrl(brandConfig.logo.ogImage)],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      en: absoluteUrl("/en"),
      ar: absoluteUrl("/ar"),
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
