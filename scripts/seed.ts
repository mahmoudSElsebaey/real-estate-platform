/**
 * Full demo seed for Aqarco
 * Usage: npm run seed
 * Requires MONGODB_URI in .env.local
 *
 * Creates: 7 users, ~40 properties (sale/rent/invest/hotel + pending),
 * favorites, inquiries, bookings, investment interests.
 * Password for all demo users: Demo@12345
 */
import { config } from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Set it in .env.local");
  process.exit(1);
}

const DEMO_PASSWORD = "Demo@12345";

const users = [
  { name: "Admin Aqarco", email: "admin@aqarco.demo", role: "admin", phone: "+201000000001", preferredLocale: "en" },
  { name: "Omar Owner", email: "owner@aqarco.demo", role: "owner", phone: "+201000000002", preferredLocale: "ar" },
  { name: "Sara Agent", email: "agent@aqarco.demo", role: "agent", phone: "+201000000003", preferredLocale: "en" },
  { name: "Layla Investor", email: "investor@aqarco.demo", role: "investor", phone: "+201000000004", preferredLocale: "en" },
  { name: "Hassan Buyer", email: "buyer@aqarco.demo", role: "buyer", phone: "+201000000005", preferredLocale: "ar" },
  { name: "Nour Renter", email: "renter@aqarco.demo", role: "renter", phone: "+201000000006", preferredLocale: "en" },
  { name: "Hotel Nile", email: "hotel@aqarco.demo", role: "hotel_operator", phone: "+201000000007", preferredLocale: "en" },
] as const;

const PHOTOS = {
  apt1: "photo-1502672260266-1c1ef2d93688",
  apt2: "photo-1522708323590-d24dbb6b0267",
  apt3: "photo-1560448204-e02f11c3d0e2",
  apt4: "photo-1493809842364-78817add7ffb",
  apt5: "photo-1560448204-603b3fc33ddc",
  villa1: "photo-1613490493576-7fde63acd811",
  villa2: "photo-1600596542815-ffad4c1539a9",
  villa3: "photo-1600585154340-be6161a56a0c",
  villa4: "photo-1600607687939-ce8a6c25118c",
  villa5: "photo-1564013799919-ab600027ffc6",
  pent1: "photo-1512917774080-9991f1c4c750",
  pent2: "photo-1545324418-cc1a3fa10c00",
  studio1: "photo-1536376072261-38c75010e6c9",
  studio2: "photo-1505693416388-ac5ce068fe85",
  duplex1: "photo-1600566753190-17f0baa2a6c3",
  town1: "photo-1600585154526-990dced4db0d",
  office1: "photo-1497366216548-37526070297c",
  office2: "photo-1497366811353-6870744d04b2",
  retail1: "photo-1441986300917-64674bd600d8",
  land1: "photo-1500382017468-9049fed747ef",
  hotel1: "photo-1566073771259-6a8506099945",
  hotel2: "photo-1582719478250-c89cae4dc85b",
  hotel3: "photo-1571896349842-33c89424de2d",
  hotel4: "photo-1520250497591-112f2f40a3f4",
  resort1: "photo-1584132967334-10e028bd69f7",
  resort2: "photo-1571003123894-1f0594d2b5d9",
  chalet1: "photo-1499793983690-e29da59ef1c2",
  chalet2: "photo-1439066615861-d1af74d74000",
  kitchen: "photo-1556912173-3bb406ef7e77",
  living: "photo-1586023492125-27b2c045efd7",
  bedroom: "photo-1616594039964-ae9021a400a0",
  pool: "photo-1575429198097-0414ec08e8cd",
  exterior: "photo-1600047509358-9dc75507daeb",
  modern: "photo-1600210492486-724fe5c67fb0",
  luxury: "photo-1600607687644-c7171b42498f",
  coast: "photo-1507525428034-b723cf961d3e",
};

function img(id: string, alt: string, primary = true, order = 0) {
  return {
    url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=85`,
    isPrimary: primary,
    order,
    alt,
  };
}

function gallery(ids: string[], alt: string) {
  return ids.map((id, i) => img(id, `${alt} ${i + 1}`, i === 0, i));
}

type PropSeed = {
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  type: string;
  purpose: string;
  status: string;
  price: number;
  rentalPrice?: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  furnishing?: string;
  amenities: string[];
  location: { city: string; district?: string; address?: string; country?: string };
  images: ReturnType<typeof img>[];
  ownerKey: "owner" | "agent" | "hotel";
  isFeatured?: boolean;
  views?: number;
};

const properties: PropSeed[] = [
  {
    title: { en: "Nile View Apartment in Zamalek", ar: "شقة بإطلالة على النيل في الزمالك" },
    description: { en: "Bright 3-bedroom apartment overlooking the Nile with modern finishes, balcony, and open living area.", ar: "شقة مشرقة من 3 غرف تطل على النيل بتشطيبات حديثة وشرفة وصالة مفتوحة." },
    type: "apartment", purpose: "sale", status: "published",
    price: 12500000, area: 180, bedrooms: 3, bathrooms: 2, floor: 8, totalFloors: 12, yearBuilt: 2019,
    furnishing: "semi_furnished", amenities: ["elevator", "parking", "security", "balcony", "ac"],
    location: { city: "Cairo", district: "Zamalek", address: "26th July St", country: "Egypt" },
    images: gallery([PHOTOS.apt1, PHOTOS.living, PHOTOS.kitchen, PHOTOS.bedroom], "Zamalek apartment"),
    ownerKey: "owner", isFeatured: true, views: 420,
  },
  {
    title: { en: "Modern Flat in New Cairo", ar: "شقة عصرية في القاهرة الجديدة" },
    description: { en: "Spacious 2-bedroom flat near AUC with smart home features and community pool access.", ar: "شقة واسعة غرفتين قرب الجامعة الأمريكية بمميزات منزل ذكي ومسبح مجتمعي." },
    type: "apartment", purpose: "sale", status: "published",
    price: 6800000, area: 140, bedrooms: 2, bathrooms: 2, floor: 4, totalFloors: 10, yearBuilt: 2021,
    furnishing: "unfurnished", amenities: ["elevator", "parking", "pool", "gym", "security"],
    location: { city: "New Cairo", district: "Fifth Settlement", country: "Egypt" },
    images: gallery([PHOTOS.apt2, PHOTOS.modern, PHOTOS.kitchen], "New Cairo flat"),
    ownerKey: "agent", isFeatured: true, views: 310,
  },
  {
    title: { en: "Family Apartment in Maadi", ar: "شقة عائلية في المعادي" },
    description: { en: "Quiet residential apartment with garden view, ideal for families near international schools.", ar: "شقة هادئة بإطلالة حديقة مناسبة للعائلات قرب المدارس الدولية." },
    type: "apartment", purpose: "sale", status: "published",
    price: 9200000, area: 200, bedrooms: 4, bathrooms: 3, floor: 2, totalFloors: 5, yearBuilt: 2015,
    furnishing: "furnished", amenities: ["parking", "garden", "security", "storage"],
    location: { city: "Cairo", district: "Maadi", country: "Egypt" },
    images: gallery([PHOTOS.apt3, PHOTOS.living, PHOTOS.exterior], "Maadi apartment"),
    ownerKey: "owner", views: 180,
  },
  {
    title: { en: "Corner Apartment Sheikh Zayed", ar: "شقة زاوية في الشيخ زايد" },
    description: { en: "Corner unit with dual exposure, large kitchen, and covered parking in gated compound.", ar: "وحدة زاوية بإطلالة مزدوجة ومطبخ كبير وباركنج مغطى بكمبوند مغلق." },
    type: "apartment", purpose: "sale", status: "published",
    price: 5400000, area: 165, bedrooms: 3, bathrooms: 2, floor: 6, totalFloors: 8, yearBuilt: 2020,
    furnishing: "semi_furnished", amenities: ["elevator", "parking", "security", "clubhouse"],
    location: { city: "Giza", district: "Sheikh Zayed", country: "Egypt" },
    images: gallery([PHOTOS.apt4, PHOTOS.kitchen, PHOTOS.bedroom], "Sheikh Zayed apartment"),
    ownerKey: "agent", views: 95,
  },
  {
    title: { en: "Garden Villa in New Cairo", ar: "فيلا بحديقة في القاهرة الجديدة" },
    description: { en: "Standalone villa with private garden, 5 bedrooms, maid room, and outdoor seating.", ar: "فيلا مستقلة بحديقة خاصة و5 غرف وغرفة خادمة وجلسة خارجية." },
    type: "villa", purpose: "sale", status: "published",
    price: 28000000, area: 450, bedrooms: 5, bathrooms: 5, yearBuilt: 2018,
    furnishing: "semi_furnished", amenities: ["garden", "parking", "security", "pool", "maid_room"],
    location: { city: "New Cairo", district: "Katameya", country: "Egypt" },
    images: gallery([PHOTOS.villa1, PHOTOS.villa2, PHOTOS.pool, PHOTOS.living], "New Cairo villa"),
    ownerKey: "owner", isFeatured: true, views: 560,
  },
  {
    title: { en: "Modern Villa North Coast", ar: "فيلا عصرية بالساحل الشمالي" },
    description: { en: "Sea-view villa in a premium North Coast resort community with private pool.", ar: "فيلا بإطلالة بحرية في منتجع راقٍ بالساحل الشمالي مع مسبح خاص." },
    type: "villa", purpose: "sale", status: "published",
    price: 22000000, area: 380, bedrooms: 4, bathrooms: 4, yearBuilt: 2022,
    furnishing: "furnished", amenities: ["pool", "garden", "parking", "security", "beach_access"],
    location: { city: "North Coast", district: "Hacienda Bay", country: "Egypt" },
    images: gallery([PHOTOS.villa3, PHOTOS.coast, PHOTOS.pool, PHOTOS.luxury], "North Coast villa"),
    ownerKey: "owner", isFeatured: true, views: 890,
  },
  {
    title: { en: "Family Villa 6th of October", ar: "فيلا عائلية بـ 6 أكتوبر" },
    description: { en: "Spacious villa in Beverly Hills compound with landscaped garden and garage.", ar: "فيلا واسعة بكمبوند بيڤرلي هيلز بحديقة منسقة وجراج." },
    type: "villa", purpose: "sale", status: "published",
    price: 18500000, area: 420, bedrooms: 5, bathrooms: 4, yearBuilt: 2016,
    furnishing: "unfurnished", amenities: ["garden", "parking", "security", "clubhouse"],
    location: { city: "Giza", district: "6th of October", country: "Egypt" },
    images: gallery([PHOTOS.villa4, PHOTOS.exterior, PHOTOS.living], "October villa"),
    ownerKey: "agent", views: 240,
  },
  {
    title: { en: "Luxury Villa Palm Hills", ar: "فيلا فاخرة ببالم هيلز" },
    description: { en: "Premium finished villa with smart systems, cinema room, and infinity-style pool.", ar: "فيلا بتشطيب فاخر وأنظمة ذكية وغرفة سينما ومسبح إنفينيتي." },
    type: "villa", purpose: "sale", status: "published",
    price: 35000000, area: 520, bedrooms: 6, bathrooms: 6, yearBuilt: 2023,
    furnishing: "furnished", amenities: ["pool", "garden", "parking", "security", "gym", "cinema"],
    location: { city: "Giza", district: "Palm Hills", country: "Egypt" },
    images: gallery([PHOTOS.villa5, PHOTOS.luxury, PHOTOS.pool, PHOTOS.modern], "Palm Hills villa"),
    ownerKey: "owner", isFeatured: true, views: 720,
  },
  {
    title: { en: "Penthouse with Terrace Downtown", ar: "بنتهاوس بترسة وسط البلد" },
    description: { en: "Exclusive penthouse with panoramic terrace and high-end finishes in central Cairo.", ar: "بنتهاوس حصري بترسة بانورامية وتشطيبات راقية بوسط القاهرة." },
    type: "penthouse", purpose: "sale", status: "published",
    price: 19500000, area: 320, bedrooms: 4, bathrooms: 3, floor: 18, totalFloors: 18, yearBuilt: 2020,
    furnishing: "semi_furnished", amenities: ["elevator", "parking", "security", "terrace", "ac"],
    location: { city: "Cairo", district: "Downtown", country: "Egypt" },
    images: gallery([PHOTOS.pent1, PHOTOS.pent2, PHOTOS.living], "Downtown penthouse"),
    ownerKey: "agent", isFeatured: true, views: 410,
  },
  {
    title: { en: "Duplex in Rehab City", ar: "دوبلكس بمدينة الرحاب" },
    description: { en: "Two-level duplex with internal stairs, private entrance, and compound amenities.", ar: "دوبلكس دورين بسلم داخلي ومدخل خاص ومرافق الكمبوند." },
    type: "duplex", purpose: "sale", status: "published",
    price: 7800000, area: 250, bedrooms: 4, bathrooms: 3, yearBuilt: 2017,
    furnishing: "unfurnished", amenities: ["parking", "security", "garden", "clubhouse"],
    location: { city: "Cairo", district: "Rehab", country: "Egypt" },
    images: gallery([PHOTOS.duplex1, PHOTOS.living, PHOTOS.kitchen], "Rehab duplex"),
    ownerKey: "owner", views: 150,
  },
  {
    title: { en: "Townhouse Mountain View", ar: "تاون هاوس ماونتن فيو" },
    description: { en: "3-storey townhouse with roof terrace in Mountain View iCity.", ar: "تاون هاوس 3 أدوار بسطح في ماونتن فيو آي سيتي." },
    type: "townhouse", purpose: "sale", status: "published",
    price: 11200000, area: 280, bedrooms: 4, bathrooms: 3, yearBuilt: 2021,
    furnishing: "semi_furnished", amenities: ["parking", "security", "roof", "clubhouse"],
    location: { city: "New Cairo", district: "Mountain View", country: "Egypt" },
    images: gallery([PHOTOS.town1, PHOTOS.exterior, PHOTOS.bedroom], "Mountain View townhouse"),
    ownerKey: "agent", views: 200,
  },
  {
    title: { en: "Bright Studio in Nasr City", ar: "ستوديو مشرق بمدينة نصر" },
    description: { en: "Compact studio ideal for singles or investment, near metro and malls.", ar: "ستوديو مدمج مناسب للأفراد أو الاستثمار قرب المترو والمولات." },
    type: "studio", purpose: "sale", status: "published",
    price: 1850000, area: 55, bedrooms: 0, bathrooms: 1, floor: 5, totalFloors: 12, yearBuilt: 2019,
    furnishing: "furnished", amenities: ["elevator", "security", "ac"],
    location: { city: "Cairo", district: "Nasr City", country: "Egypt" },
    images: gallery([PHOTOS.studio1, PHOTOS.studio2], "Nasr City studio"),
    ownerKey: "owner", views: 88,
  },
  {
    title: { en: "Office Space in Smart Village", ar: "مكتب إداري بالقرية الذكية" },
    description: { en: "Fitted office floor with meeting rooms and open workspace near major tech companies.", ar: "دور مكتبي مجهز بغرف اجتماعات ومساحات مفتوحة قرب شركات التكنولوجيا." },
    type: "office", purpose: "sale", status: "published",
    price: 15000000, area: 400, bathrooms: 2, floor: 3, totalFloors: 6, yearBuilt: 2014,
    furnishing: "semi_furnished", amenities: ["elevator", "parking", "security", "ac", "fiber"],
    location: { city: "Giza", district: "Smart Village", country: "Egypt" },
    images: gallery([PHOTOS.office1, PHOTOS.office2], "Smart Village office"),
    ownerKey: "agent", views: 130,
  },
  {
    title: { en: "Retail Shop in Mall of Egypt", ar: "محل تجاري بمول مصر" },
    description: { en: "Prime retail unit on high-traffic floor inside Mall of Egypt.", ar: "وحدة تجارية مميزة بطابق حركة عالية داخل مول مصر." },
    type: "retail", purpose: "sale", status: "published",
    price: 9800000, area: 90, bathrooms: 1, floor: 1, totalFloors: 3, yearBuilt: 2017,
    furnishing: "unfurnished", amenities: ["security", "parking", "ac", "storage"],
    location: { city: "Giza", district: "6th of October", address: "Mall of Egypt", country: "Egypt" },
    images: gallery([PHOTOS.retail1], "Mall retail"),
    ownerKey: "owner", views: 70,
  },
  {
    title: { en: "Residential Land Plot New Capital", ar: "قطعة أرض سكنية بالعاصمة الإدارية" },
    description: { en: "Corner residential plot ready for building in R3 district, New Administrative Capital.", ar: "قطعة سكنية زاوية جاهزة للبناء بحي R3 بالعاصمة الإدارية." },
    type: "land", purpose: "sale", status: "published",
    price: 4500000, area: 600, amenities: ["corner", "utilities_ready"],
    location: { city: "New Administrative Capital", district: "R3", country: "Egypt" },
    images: gallery([PHOTOS.land1], "NAC land"),
    ownerKey: "agent", views: 260,
  },
  {
    title: { en: "Furnished Flat for Rent in Zamalek", ar: "شقة مفروشة للإيجار بالزمالك" },
    description: { en: "Fully furnished 2-bedroom apartment available for long-term rent near the Nile.", ar: "شقة مفروشة بالكامل غرفتين للإيجار طويل الأجل قرب النيل." },
    type: "apartment", purpose: "rent", status: "published",
    price: 0, rentalPrice: 35000, area: 130, bedrooms: 2, bathrooms: 2, floor: 5, totalFloors: 10, yearBuilt: 2018,
    furnishing: "furnished", amenities: ["elevator", "parking", "security", "ac", "wifi"],
    location: { city: "Cairo", district: "Zamalek", country: "Egypt" },
    images: gallery([PHOTOS.apt5, PHOTOS.living, PHOTOS.bedroom], "Zamalek rent"),
    ownerKey: "owner", isFeatured: true, views: 380,
  },
  {
    title: { en: "Family Home Rent in Maadi", ar: "منزل عائلي للإيجار بالمعادي" },
    description: { en: "Spacious 4-bedroom rental with private garden and parking, quiet street.", ar: "إيجار واسع 4 غرف بحديقة خاصة وباركنج في شارع هادئ." },
    type: "villa", purpose: "rent", status: "published",
    price: 0, rentalPrice: 75000, area: 300, bedrooms: 4, bathrooms: 3, yearBuilt: 2012,
    furnishing: "semi_furnished", amenities: ["garden", "parking", "security", "ac"],
    location: { city: "Cairo", district: "Maadi", country: "Egypt" },
    images: gallery([PHOTOS.villa2, PHOTOS.exterior, PHOTOS.living], "Maadi rent"),
    ownerKey: "agent", views: 190,
  },
  {
    title: { en: "Studio Rent near AUC", ar: "ستوديو للإيجار قرب الجامعة الأمريكية" },
    description: { en: "Affordable furnished studio for students or young professionals in New Cairo.", ar: "ستوديو مفروش اقتصادي للطلاب أو الشباب بالقاهرة الجديدة." },
    type: "studio", purpose: "rent", status: "published",
    price: 0, rentalPrice: 12000, area: 48, bedrooms: 0, bathrooms: 1, floor: 3, totalFloors: 8, yearBuilt: 2020,
    furnishing: "furnished", amenities: ["elevator", "security", "wifi", "ac"],
    location: { city: "New Cairo", district: "Fifth Settlement", country: "Egypt" },
    images: gallery([PHOTOS.studio2, PHOTOS.studio1], "AUC studio rent"),
    ownerKey: "owner", views: 220,
  },
  {
    title: { en: "Penthouse Rent with Nile View", ar: "بنتهاوس للإيجار بإطلالة نيلية" },
    description: { en: "Luxury penthouse rental with full Nile view, maid room, and 24/7 security.", ar: "بنتهاوس فاخر للإيجار بإطلالة نيلية كاملة وغرفة خادمة وأمن 24 ساعة." },
    type: "penthouse", purpose: "rent", status: "published",
    price: 0, rentalPrice: 120000, area: 280, bedrooms: 3, bathrooms: 3, floor: 15, totalFloors: 15, yearBuilt: 2019,
    furnishing: "furnished", amenities: ["elevator", "parking", "security", "ac", "balcony", "maid_room"],
    location: { city: "Cairo", district: "Garden City", country: "Egypt" },
    images: gallery([PHOTOS.pent2, PHOTOS.apt1, PHOTOS.luxury], "Nile penthouse rent"),
    ownerKey: "owner", isFeatured: true, views: 340,
  },
  {
    title: { en: "Office Rent in Downtown", ar: "مكتب للإيجار بوسط البلد" },
    description: { en: "Flexible office space suitable for startups, monthly contract available.", ar: "مساحة مكتبية مرنة مناسبة للشركات الناشئة بعقد شهري." },
    type: "office", purpose: "rent", status: "published",
    price: 0, rentalPrice: 45000, area: 120, bathrooms: 1, floor: 4, totalFloors: 8, yearBuilt: 2010,
    furnishing: "semi_furnished", amenities: ["elevator", "security", "ac", "parking"],
    location: { city: "Cairo", district: "Downtown", country: "Egypt" },
    images: gallery([PHOTOS.office2, PHOTOS.office1], "Downtown office rent"),
    ownerKey: "agent", views: 110,
  },
  {
    title: { en: "Chalet Seasonal Rent North Coast", ar: "شاليه للإيجار الموسمي بالساحل" },
    description: { en: "Beachfront chalet available for summer season with shared pool and beach access.", ar: "شاليه على البحر للإيجار الصيفي مع مسبح مشترك ومدخل شاطئ." },
    type: "chalet", purpose: "rent", status: "published",
    price: 0, rentalPrice: 25000, area: 110, bedrooms: 2, bathrooms: 2, yearBuilt: 2018,
    furnishing: "furnished", amenities: ["pool", "beach_access", "parking", "security", "ac"],
    location: { city: "North Coast", district: "Marina", country: "Egypt" },
    images: gallery([PHOTOS.chalet1, PHOTOS.chalet2, PHOTOS.coast], "North Coast chalet"),
    ownerKey: "owner", isFeatured: true, views: 510,
  },
  {
    title: { en: "Duplex Rent in Sheikh Zayed", ar: "دوبلكس للإيجار بالشيخ زايد" },
    description: { en: "Bright duplex in gated community, ideal for expatriate families.", ar: "دوبلكس مشرق بكمبوند مغلق مناسب للعائلات المغتربة." },
    type: "duplex", purpose: "rent", status: "published",
    price: 0, rentalPrice: 55000, area: 220, bedrooms: 3, bathrooms: 3, yearBuilt: 2019,
    furnishing: "furnished", amenities: ["parking", "security", "pool", "gym", "ac"],
    location: { city: "Giza", district: "Sheikh Zayed", country: "Egypt" },
    images: gallery([PHOTOS.duplex1, PHOTOS.living, PHOTOS.modern], "Zayed duplex rent"),
    ownerKey: "agent", views: 145,
  },
  {
    title: { en: "Investment Apartment New Capital", ar: "شقة استثمارية بالعاصمة الإدارية" },
    description: { en: "High-ROI apartment in a developing district with strong rental demand forecast.", ar: "شقة بعائد استثماري مرتفع في حي نامٍ مع توقع طلب إيجاري قوي." },
    type: "apartment", purpose: "invest", status: "published",
    price: 3200000, area: 95, bedrooms: 2, bathrooms: 1, floor: 7, totalFloors: 14, yearBuilt: 2024,
    furnishing: "unfurnished", amenities: ["elevator", "parking", "security"],
    location: { city: "New Administrative Capital", district: "R7", country: "Egypt" },
    images: gallery([PHOTOS.apt2, PHOTOS.modern], "NAC investment apt"),
    ownerKey: "agent", isFeatured: true, views: 430,
  },
  {
    title: { en: "Coastal Investment Chalet", ar: "شاليه استثماري ساحلي" },
    description: { en: "Fully managed chalet with proven seasonal rental income on the North Coast.", ar: "شاليه بإدارة كاملة ودخل إيجاري موسمي مثبت على الساحل الشمالي." },
    type: "chalet", purpose: "invest", status: "published",
    price: 8500000, area: 95, bedrooms: 2, bathrooms: 1, yearBuilt: 2020,
    furnishing: "furnished", amenities: ["pool", "beach_access", "parking", "management"],
    location: { city: "North Coast", district: "Ras El Hekma", country: "Egypt" },
    images: gallery([PHOTOS.chalet2, PHOTOS.coast, PHOTOS.pool], "Coastal invest chalet"),
    ownerKey: "owner", isFeatured: true, views: 390,
  },
  {
    title: { en: "Commercial Building Share Opportunity", ar: "فرصة حصة في مبنى تجاري" },
    description: { en: "Partial ownership opportunity in a mixed-use building with long-term tenants.", ar: "فرصة ملكية جزئية في مبنى متعدد الاستخدامات بمستأجرين طويل الأجل." },
    type: "retail", purpose: "invest", status: "published",
    price: 12000000, area: 200, yearBuilt: 2015,
    furnishing: "unfurnished", amenities: ["parking", "security", "elevator"],
    location: { city: "Cairo", district: "Heliopolis", country: "Egypt" },
    images: gallery([PHOTOS.retail1, PHOTOS.office1], "Commercial invest"),
    ownerKey: "agent", views: 175,
  },
  {
    title: { en: "Off-Plan Villa Investment", ar: "استثمار فيلا تحت الإنشاء" },
    description: { en: "Early-bird pricing on an off-plan villa with flexible payment plan over 6 years.", ar: "سعر مبكر لفيلا تحت الإنشاء بنظام سداد مرن على 6 سنوات." },
    type: "villa", purpose: "invest", status: "published",
    price: 14000000, area: 350, bedrooms: 4, bathrooms: 4, yearBuilt: 2027,
    furnishing: "unfurnished", amenities: ["garden", "pool", "security", "payment_plan"],
    location: { city: "New Cairo", district: "Mostakbal City", country: "Egypt" },
    images: gallery([PHOTOS.villa1, PHOTOS.villa3, PHOTOS.exterior], "Off-plan villa"),
    ownerKey: "owner", isFeatured: true, views: 620,
  },
  {
    title: { en: "Both Sale & Rent Apartment Mohandessin", ar: "شقة للبيع والإيجار بالمهندسين" },
    description: { en: "Flexible listing: available for purchase or long-term rental in Mohandessin.", ar: "إعلان مرن: متاحة للشراء أو الإيجار طويل الأجل بالمهندسين." },
    type: "apartment", purpose: "both", status: "published",
    price: 7500000, rentalPrice: 28000, area: 160, bedrooms: 3, bathrooms: 2, floor: 6, totalFloors: 11, yearBuilt: 2016,
    furnishing: "semi_furnished", amenities: ["elevator", "parking", "security", "ac"],
    location: { city: "Giza", district: "Mohandessin", country: "Egypt" },
    images: gallery([PHOTOS.apt3, PHOTOS.kitchen, PHOTOS.bedroom], "Mohandessin both"),
    ownerKey: "owner", views: 205,
  },
  {
    title: { en: "Boutique Hotel Nile Corniche", ar: "فندق بوتيك كورنيش النيل" },
    description: { en: "Boutique hotel with 24 rooms overlooking the Nile, restaurant and rooftop lounge.", ar: "فندق بوتيك 24 غرفة مطل على النيل مع مطعم ولاونج على السطح." },
    type: "hotel", purpose: "both", status: "published",
    price: 85000000, rentalPrice: 2500, area: 2200, bedrooms: 24, bathrooms: 28, yearBuilt: 2015,
    furnishing: "furnished", amenities: ["restaurant", "rooftop", "parking", "security", "wifi", "ac"],
    location: { city: "Cairo", district: "Garden City", country: "Egypt" },
    images: gallery([PHOTOS.hotel1, PHOTOS.hotel2, PHOTOS.luxury], "Boutique hotel"),
    ownerKey: "hotel", isFeatured: true, views: 480,
  },
  {
    title: { en: "Red Sea Resort Package", ar: "منتجع البحر الأحمر" },
    description: { en: "Beach resort with 60 units, dive center access, and all-inclusive operations.", ar: "منتجع شاطئي 60 وحدة مع مركز غوص وتشغيل شامل." },
    type: "resort", purpose: "invest", status: "published",
    price: 220000000, area: 15000, bedrooms: 60, bathrooms: 70, yearBuilt: 2012,
    furnishing: "furnished", amenities: ["beach_access", "pool", "restaurant", "spa", "diving", "parking"],
    location: { city: "Hurghada", district: "Sahl Hasheesh", country: "Egypt" },
    images: gallery([PHOTOS.resort1, PHOTOS.resort2, PHOTOS.hotel3, PHOTOS.pool], "Red Sea resort"),
    ownerKey: "hotel", isFeatured: true, views: 910,
  },
  {
    title: { en: "City Hotel Rooms Block", ar: "بلوك غرف فندق مدينة" },
    description: { en: "Block of 12 hotel rooms available for franchise or long-stay management.", ar: "بلوك 12 غرفة فندقية متاح للفرانشايز أو إدارة الإقامة الطويلة." },
    type: "hotel", purpose: "rent", status: "published",
    price: 0, rentalPrice: 180000, area: 600, bedrooms: 12, bathrooms: 12, yearBuilt: 2018,
    furnishing: "furnished", amenities: ["wifi", "ac", "security", "laundry", "reception"],
    location: { city: "Cairo", district: "Nasr City", country: "Egypt" },
    images: gallery([PHOTOS.hotel4, PHOTOS.hotel2, PHOTOS.bedroom], "City hotel block"),
    ownerKey: "hotel", views: 160,
  },
  {
    title: { en: "Ain Sokhna Resort Chalet Units", ar: "وحدات شاليهات العين السخنة" },
    description: { en: "Cluster of resort chalets with sea view, managed rental program included.", ar: "مجموعة شاليهات منتجع بإطلالة بحرية وبرنامج إيجار مُدار." },
    type: "resort", purpose: "both", status: "published",
    price: 45000000, rentalPrice: 80000, area: 1800, bedrooms: 16, bathrooms: 18, yearBuilt: 2019,
    furnishing: "furnished", amenities: ["pool", "beach_access", "restaurant", "parking", "security"],
    location: { city: "Ain Sokhna", district: "Porto Sokhna", country: "Egypt" },
    images: gallery([PHOTOS.resort2, PHOTOS.chalet1, PHOTOS.pool, PHOTOS.coast], "Sokhna resort"),
    ownerKey: "hotel", isFeatured: true, views: 540,
  },
  {
    title: { en: "Pending Villa Eastown", ar: "فيلا قيد المراجعة إيستاون" },
    description: { en: "Newly submitted villa listing awaiting admin approval. Modern finishes throughout.", ar: "إعلان فيلا جديد بانتظار موافقة الإدارة. تشطيبات حديثة بالكامل." },
    type: "villa", purpose: "sale", status: "pending",
    price: 24000000, area: 400, bedrooms: 5, bathrooms: 4, yearBuilt: 2022,
    furnishing: "semi_furnished", amenities: ["garden", "parking", "security", "pool"],
    location: { city: "New Cairo", district: "Eastown", country: "Egypt" },
    images: gallery([PHOTOS.villa5, PHOTOS.pool, PHOTOS.living], "Pending villa"),
    ownerKey: "owner", views: 12,
  },
  {
    title: { en: "Pending Apartment Gouna", ar: "شقة قيد المراجعة بالجونة" },
    description: { en: "Lagoon-view apartment submitted for review. Ideal holiday home.", ar: "شقة بإطلالة لاجون مقدمة للمراجعة. مثالية كمنزل عطلات." },
    type: "apartment", purpose: "sale", status: "pending",
    price: 9800000, area: 145, bedrooms: 2, bathrooms: 2, floor: 2, totalFloors: 4, yearBuilt: 2021,
    furnishing: "furnished", amenities: ["pool", "security", "parking", "beach_access"],
    location: { city: "El Gouna", district: "Ancient Gouna", country: "Egypt" },
    images: gallery([PHOTOS.apt1, PHOTOS.coast, PHOTOS.pool], "Pending Gouna apt"),
    ownerKey: "agent", views: 8,
  },
  {
    title: { en: "Pending Hotel Unit Alexandria", ar: "وحدة فندقية قيد المراجعة بالإسكندرية" },
    description: { en: "Seafront hotel unit pending moderation. Strong summer occupancy history.", ar: "وحدة فندقية على البحر قيد المراجعة. سجل إشغال صيفي قوي." },
    type: "hotel", purpose: "invest", status: "pending",
    price: 6500000, area: 75, bedrooms: 1, bathrooms: 1, yearBuilt: 2017,
    furnishing: "furnished", amenities: ["wifi", "ac", "security", "restaurant"],
    location: { city: "Alexandria", district: "Stanley", country: "Egypt" },
    images: gallery([PHOTOS.hotel3, PHOTOS.hotel1], "Pending Alex hotel"),
    ownerKey: "hotel", views: 5,
  },
  {
    title: { en: "Pending Studio for Rent Dokki", ar: "ستوديو إيجار قيد المراجعة بالدقي" },
    description: { en: "Compact rental studio near Cairo University awaiting approval.", ar: "ستوديو إيجار مدمج قرب جامعة القاهرة بانتظار الموافقة." },
    type: "studio", purpose: "rent", status: "pending",
    price: 0, rentalPrice: 9000, area: 42, bedrooms: 0, bathrooms: 1, floor: 4, totalFloors: 7, yearBuilt: 2011,
    furnishing: "furnished", amenities: ["elevator", "security", "ac"],
    location: { city: "Giza", district: "Dokki", country: "Egypt" },
    images: gallery([PHOTOS.studio1], "Pending Dokki studio"),
    ownerKey: "owner", views: 3,
  },
  {
    title: { en: "Pending Land Plot Sheikh Zayed", ar: "أرض قيد المراجعة بالشيخ زايد" },
    description: { en: "Residential land listing submitted by agent, pending verification of documents.", ar: "إعلان أرض سكنية من الوكيل بانتظار التحقق من المستندات." },
    type: "land", purpose: "sale", status: "pending",
    price: 6200000, area: 500, amenities: ["corner"],
    location: { city: "Giza", district: "Sheikh Zayed", country: "Egypt" },
    images: gallery([PHOTOS.land1], "Pending land"),
    ownerKey: "agent", views: 2,
  },
  {
    title: { en: "Pending Investment Office Smart Village", ar: "مكتب استثماري قيد المراجعة بالقرية الذكية" },
    description: { en: "Office unit offered as investment with current tenant; pending admin review.", ar: "وحدة مكتبية كاستثمار بمستأجر حالي؛ قيد مراجعة الإدارة." },
    type: "office", purpose: "invest", status: "pending",
    price: 8900000, area: 180, bathrooms: 1, floor: 2, totalFloors: 5, yearBuilt: 2013,
    furnishing: "semi_furnished", amenities: ["elevator", "parking", "security", "ac"],
    location: { city: "Giza", district: "Smart Village", country: "Egypt" },
    images: gallery([PHOTOS.office1, PHOTOS.office2], "Pending office invest"),
    ownerKey: "owner", views: 6,
  },
];

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);

  const UserSchema = new mongoose.Schema({
    name: String, email: { type: String, unique: true }, password: String, role: String,
    phone: String, preferredLocale: { type: String, default: "en" },
    isVerified: { type: Boolean, default: true }, isActive: { type: Boolean, default: true },
  }, { timestamps: true });

  const PropertySchema = new mongoose.Schema({
    title: { en: String, ar: String }, description: { en: String, ar: String },
    type: String, purpose: String, status: String, price: Number, rentalPrice: Number,
    currency: { type: String, default: "EGP" }, area: Number, bedrooms: Number, bathrooms: Number,
    floor: Number, totalFloors: Number, yearBuilt: Number, furnishing: String, amenities: [String],
    location: { city: String, district: String, address: String, country: { type: String, default: "Egypt" } },
    images: [{ url: String, publicId: String, isPrimary: Boolean, order: Number, alt: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, isFeatured: Boolean,
    views: { type: Number, default: 0 }, publishedAt: Date,
  }, { timestamps: true });

  const FavoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  }, { timestamps: true });
  FavoriteSchema.index({ user: 1, property: 1 }, { unique: true });

  const InquirySchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    propertyOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String, email: String, phone: String, type: { type: String, default: "info" },
    message: String, preferredDate: Date, status: { type: String, default: "new" }, notes: String,
  }, { timestamps: true });

  const BookingSchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    propertyOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    checkIn: Date, checkOut: Date, guests: { type: Number, default: 2 }, message: String,
    status: { type: String, default: "pending" }, estimatedTotal: Number,
    currency: { type: String, default: "EGP" }, notes: String,
  }, { timestamps: true });

  const InterestSchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    propertyOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    proposedAmount: Number, message: String, status: { type: String, default: "new" }, notes: String,
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Property = mongoose.models.Property || mongoose.model("Property", PropertySchema);
  const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);
  const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
  const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
  const InvestmentInterest = mongoose.models.InvestmentInterest || mongoose.model("InvestmentInterest", InterestSchema);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const createdUsers: Record<string, mongoose.Types.ObjectId> = {};

  for (const u of users) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      existing.password = passwordHash;
      existing.role = u.role;
      existing.name = u.name;
      existing.phone = u.phone;
      existing.isVerified = true;
      existing.isActive = true;
      await existing.save();
      createdUsers[u.email] = existing._id;
      console.log(`Updated user ${u.email} (${u.role})`);
    } else {
      const doc = await User.create({ ...u, password: passwordHash, isVerified: true, isActive: true });
      createdUsers[u.email] = doc._id;
      console.log(`Created user ${u.email} (${u.role})`);
    }
  }

  const ownerMap = {
    owner: createdUsers["owner@aqarco.demo"],
    agent: createdUsers["agent@aqarco.demo"],
    hotel: createdUsers["hotel@aqarco.demo"],
  };

  const seedOwnerIds = Object.values(ownerMap);
  await Property.deleteMany({ owner: { $in: seedOwnerIds } });
  console.log("Cleared previous seed properties for demo owners");

  const createdProps: mongoose.Types.ObjectId[] = [];

  for (const p of properties) {
    const images = (p.images || []).filter((im) => im && im.url);
    if (images.length === 0) images.push(img(PHOTOS.apt1, p.title.en));
    const ownerId = ownerMap[p.ownerKey];
    const doc = await Property.create({
      title: p.title, description: p.description, type: p.type, purpose: p.purpose, status: p.status,
      price: p.price, rentalPrice: p.rentalPrice, currency: "EGP", area: p.area,
      bedrooms: p.bedrooms, bathrooms: p.bathrooms, floor: p.floor, totalFloors: p.totalFloors,
      yearBuilt: p.yearBuilt, furnishing: p.furnishing, amenities: p.amenities,
      location: { country: "Egypt", ...p.location }, images, owner: ownerId,
      isFeatured: Boolean(p.isFeatured), views: p.views || 0,
      publishedAt: p.status === "published" ? new Date() : undefined,
    });
    createdProps.push(doc._id);
    console.log(`Property: ${p.title.en} [${p.status}/${p.purpose}/${p.type}]`);
  }

  const buyerId = createdUsers["buyer@aqarco.demo"];
  const renterId = createdUsers["renter@aqarco.demo"];
  const investorId = createdUsers["investor@aqarco.demo"];

  await Favorite.deleteMany({ user: { $in: [buyerId, renterId, investorId] } });
  const favTargets = createdProps.slice(0, 12);
  let favCount = 0;
  for (const uid of [buyerId, renterId, investorId]) {
    for (const pid of favTargets.slice(0, 6)) {
      try { await Favorite.create({ user: uid, property: pid }); favCount++; } catch { /* duplicate */ }
    }
  }
  console.log(`Favorites: ${favCount}`);

  await Inquiry.deleteMany({ email: { $in: users.map((u) => u.email) } });
  const inquirySamples = [
    { user: buyerId, type: "visit", message: "I would like to schedule a viewing this weekend." },
    { user: buyerId, type: "offer", message: "Is the price negotiable for a cash purchase?" },
    { user: renterId, type: "info", message: "What is included in the monthly rent?" },
    { user: renterId, type: "visit", message: "Can I visit with my family next Thursday?" },
    { user: investorId, type: "info", message: "Please share expected annual ROI documents." },
    { user: investorId, type: "offer", message: "Interested in a bulk purchase of two units." },
  ];
  let inqCount = 0;
  for (let i = 0; i < inquirySamples.length; i++) {
    const sample = inquirySamples[i];
    const propId = createdProps[i % createdProps.length];
    const prop = await Property.findById(propId).lean();
    if (!prop) continue;
    const u = users.find((x) => String(createdUsers[x.email]) === String(sample.user))!;
    await Inquiry.create({
      property: propId, propertyOwner: prop.owner, user: sample.user,
      name: u.name, email: u.email, phone: u.phone, type: sample.type, message: sample.message,
      preferredDate: new Date(Date.now() + (i + 2) * 86400000),
      status: i % 3 === 0 ? "contacted" : "new",
    });
    inqCount++;
  }
  console.log(`Inquiries: ${inqCount}`);

  await Booking.deleteMany({ user: { $in: [renterId, buyerId] } });
  const rentLike = createdProps.filter((_, idx) => {
    const p = properties[idx];
    return p && (p.purpose === "rent" || p.purpose === "both" || p.type === "hotel" || p.type === "resort" || p.type === "chalet");
  });
  let bookCount = 0;
  const bookingStatuses = ["pending", "confirmed", "cancelled", "pending", "confirmed"];
  for (let i = 0; i < Math.min(8, rentLike.length); i++) {
    const propId = rentLike[i];
    const prop = await Property.findById(propId).lean();
    if (!prop) continue;
    const checkIn = new Date(Date.now() + (i + 3) * 86400000);
    const checkOut = new Date(checkIn.getTime() + (i % 3 + 2) * 86400000);
    await Booking.create({
      property: propId, propertyOwner: prop.owner, user: i % 2 === 0 ? renterId : buyerId,
      checkIn, checkOut, guests: 2 + (i % 3),
      message: "Looking forward to a comfortable stay.",
      status: bookingStatuses[i % bookingStatuses.length],
      estimatedTotal: (prop.rentalPrice || 5000) * (i % 3 + 2), currency: "EGP",
    });
    bookCount++;
  }
  console.log(`Bookings: ${bookCount}`);

  await InvestmentInterest.deleteMany({ user: investorId });
  const investLike = createdProps.filter((_, idx) => {
    const p = properties[idx];
    return p && (p.purpose === "invest" || p.purpose === "both");
  });
  let intCount = 0;
  for (let i = 0; i < Math.min(6, investLike.length); i++) {
    const propId = investLike[i];
    const prop = await Property.findById(propId).lean();
    if (!prop) continue;
    await InvestmentInterest.create({
      property: propId, propertyOwner: prop.owner, user: investorId,
      proposedAmount: Math.round((prop.price || 1000000) * 0.3),
      message: "Interested in co-investment or installment partnership.",
      status: i % 2 === 0 ? "new" : "contacted",
    });
    intCount++;
  }
  console.log(`Investment interests: ${intCount}`);

  console.log("\n========== SEED COMPLETE ==========" );
  console.log(`Users: ${users.length}`);
  console.log(`Properties: ${createdProps.length}`);
  console.log(`Favorites: ${favCount}`);
  console.log(`Inquiries: ${inqCount}`);
  console.log(`Bookings: ${bookCount}`);
  console.log(`Investment interests: ${intCount}`);
  console.log(`Demo password: ${DEMO_PASSWORD}`);
  console.log("===================================\n");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
