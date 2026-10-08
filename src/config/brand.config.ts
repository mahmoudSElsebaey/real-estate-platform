/**
 * Centralized Brand Configuration
 * Never hardcode brand name or visual identity elsewhere.
 * Replace values here to rebrand the entire platform.
 */

export const brandConfig = {
  brandName: "Aqarco",
  brandNameAr: "عقاركو",
  shortName: "Aqarco",
  tagline: {
    en: "Exceptional Living. Timeless Investment.",
    ar: "حياة استثنائية. استثمار خالد.",
  },
  description: {
    en: "A premium platform for discovering, booking, and investing in exceptional real estate, resorts, and hospitality experiences.",
    ar: "منصة فاخرة لاكتشاف وحجز والاستثمار في عقارات ومنتجعات وتجارب ضيافة استثنائية.",
  },
  logo: {
    mark: "/images/logo-mark.svg",
    full: "/images/logo-full.svg",
    favicon: "/favicon.svg",
    ogImage: "/images/og-default.jpg",
  },
  contact: {
    email: "hello@aqarco.com",
    phone: "+20 100 000 0000",
    address: {
      en: "Cairo, Egypt",
      ar: "القاهرة، مصر",
    },
  },
  social: {
    instagram: "https://instagram.com/aqarco",
    twitter: "https://x.com/aqarco",
    linkedin: "https://linkedin.com/company/aqarco",
    facebook: "https://facebook.com/aqarco",
  },
  colors: {
    primary: {
      50: "152 45% 96%",
      100: "152 40% 90%",
      200: "153 38% 80%",
      300: "154 36% 65%",
      400: "155 40% 45%",
      500: "156 55% 28%",
      600: "157 60% 22%",
      700: "158 65% 17%",
      800: "159 70% 12%",
      900: "160 75% 8%",
      950: "161 80% 5%",
    },
    secondary: {
      50: "35 40% 96%",
      100: "34 35% 90%",
      200: "33 30% 80%",
      300: "32 28% 68%",
      400: "31 25% 55%",
      500: "30 22% 42%",
      600: "29 25% 34%",
      700: "28 28% 26%",
      800: "27 30% 18%",
      900: "26 32% 12%",
    },
    accent: {
      50: "42 60% 96%",
      100: "41 55% 90%",
      200: "40 50% 80%",
      300: "39 48% 68%",
      400: "38 45% 55%",
      500: "37 50% 42%",
      600: "36 55% 34%",
      700: "35 58% 26%",
      800: "34 60% 18%",
      900: "33 62% 12%",
    },
    investment: {
      DEFAULT: "168 55% 32%",
      foreground: "168 40% 96%",
    },
    premium: {
      DEFAULT: "42 70% 48%",
      foreground: "42 30% 12%",
    },
    success: "152 60% 36%",
    warning: "38 90% 50%",
    error: "0 72% 51%",
    info: "210 70% 45%",
  },
  typography: {
    display: "var(--font-display)",
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
  },
  links: {
    privacy: "/privacy",
    terms: "/terms",
    about: "/about",
    contact: "/contact",
    help: "/help",
    userGuide: "/user-guide",
  },
} as const;

export type BrandConfig = typeof brandConfig;
export default brandConfig;
