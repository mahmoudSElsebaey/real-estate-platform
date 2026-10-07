import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

const locales = ["en", "ar"] as const;

const staticPaths = [
  "",
  "/discover",
  "/investments",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/help",
  "/careers",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" || path === "/discover" ? "daily" : "monthly",
        priority: path === "" ? 1 : path === "/discover" ? 0.9 : 0.6,
      });
    }
  }

  return entries;
}
