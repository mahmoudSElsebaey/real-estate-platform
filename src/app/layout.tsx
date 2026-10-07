import type { Metadata } from "next";
import brandConfig from "@/config/brand.config";

export const metadata: Metadata = {
  title: {
    default: brandConfig.brandName,
    template: `%s | ${brandConfig.brandName}`,
  },
  description: brandConfig.description.en,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
