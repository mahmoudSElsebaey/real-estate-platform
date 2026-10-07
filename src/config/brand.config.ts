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
    en: "Find Your Place. Build Your Future.",
    ar: "مكانك يبدأ من هنا.",
  },
  description: {
    en: "A modern platform for discovering, renting, buying, and investing in exceptional real estate and hospitality experiences.",
    ar: "منصة حديثة لاكتشاف وشراء وتأجير والاستثمار في العقارات وتجارب الضيافة المميزة.",
  },
  logo: {
    mark: "/images/logo-mark.svg",
    full: "/images/logo-full.svg",
    favicon: "/favicon.svg",
    ogImage: "/images/logo-mark.svg",
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
    instagram: "https://instagram.com/aetherresidences",
    twitter: "https://x.com/aetherresidences",
    linkedin: "https://linkedin.com/company/aetherresidences",
    facebook: "https://facebook.com/aetherresidences",
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
  },
} as const;

export default brandConfig;
