/**
 * Demo seed script for Aether Residences
 * Usage: npm run seed
 * Requires MONGODB_URI in .env.local
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
  { name: "Admin Aether", email: "admin@aether.demo", role: "admin", phone: "+201000000001", preferredLocale: "en" },
  { name: "Omar Owner", email: "owner@aether.demo", role: "owner", phone: "+201000000002", preferredLocale: "ar" },
  { name: "Sara Agent", email: "agent@aether.demo", role: "agent", phone: "+201000000003", preferredLocale: "en" },
  { name: "Layla Investor", email: "investor@aether.demo", role: "investor", phone: "+201000000004", preferredLocale: "en" },
  { name: "Hassan Buyer", email: "buyer@aether.demo", role: "buyer", phone: "+201000000005", preferredLocale: "ar" },
  { name: "Nour Renter", email: "renter@aether.demo", role: "renter", phone: "+201000000006", preferredLocale: "en" },
  { name: "Hotel Nile", email: "hotel@aether.demo", role: "hotel_operator", phone: "+201000000007", preferredLocale: "en" },
] as const;

function img(id: string, alt: string) {
  return {
    url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`,
    isPrimary: true,
    order: 0,
    alt,
  };
}

function extra(id: string, order: number, alt: string) {
  return {
    url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`,
    isPrimary: false,
    order,
    alt,
  };
}

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);

  const UserSchema = new mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true },
      password: String,
      role: String,
      phone: String,
      preferredLocale: { type: String, default: "en" },
      isVerified: { type: Boolean, default: true },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  );

  const PropertySchema = new mongoose.Schema(
    {
      title: { en: String, ar: String },
      description: { en: String, ar: String },
      type: String,
      purpose: String,
      status: String,
      price: Number,
      rentalPrice: Number,
      currency: { type: String, default: "EGP" },
      area: Number,
      bedrooms: Number,
      bathrooms: Number,
      floor: Number,
      totalFloors: Number,
      yearBuilt: Number,
      furnishing: String,
      amenities: [String],
      location: {
        city: String,
        district: String,
        address: String,
        country: String,
      },
      images: [
        {
          url: String,
          publicId: String,
          isPrimary: Boolean,
          order: Number,
          alt: String,
        },
      ],
      owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      isFeatured: Boolean,
      views: { type: Number, default: 0 },
      publishedAt: Date,
    },
    { timestamps: true }
  );

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Property = mongoose.models.Property || mongoose.model("Property", PropertySchema);

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
      const doc = await User.create({
        ...u,
        password: passwordHash,
        isVerified: true,
        isActive: true,
      });
      createdUsers[u.email] = doc._id;
      console.log(`Created user ${u.email} (${u.role})`);
    }
  }

  const ownerId = createdUsers["owner@aether.demo"];
  const agentId = createdUsers["agent@aether.demo"];
  const hotelId = createdUsers["hotel@aether.demo"];

  const properties = [
    {
      title: { en: "Nile View Apartment in Zamalek", ar: "شقة بإطلالة على النيل في الزمالك" },
      description: {
        en: "Bright 3-bedroom apartment overlooking the Nile with modern finishes and balcony.",
        ar: "شقة مشرقة من 3 غرف تطل على النيل بتشطيبات حديثة وشرفة.",
      },
      type: "apartment",
      purpose: "sale",
      status: "published",
      price: 12500000,
      currency: "EGP",
      area: 180,
      bedrooms: 3,
      bathrooms: 2,
      floor: 8,
      totalFloors: 12,
      yearBuilt: 2019,
      furnishing: "semi_furnished",
      amenities: ["elevator", "balcony", "security", "parking"],
      location: { city: "Cairo", district: "Zamalek", address: "26th of July Street", country: "Egypt" },
      images: [img("photo-1502672260266-1c1ef2d93688", "Living room"), extra("photo-1560448204-e02f11c3d0e2", 1, "Bedroom")],
      owner: ownerId,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: { en: "Garden Villa in New Cairo", ar: "فيلا بحديقة في القاهرة الجديدة" },
      description: {
        en: "Spacious family villa with private garden, pool, and smart home system.",
        ar: "فيلا عائلية واسعة بحديقة خاصة ومسبح ونظام منزل ذكي.",
      },
      type: "villa",
      purpose: "sale",
      status: "published",
      price: 28000000,
      currency: "EGP",
      area: 420,
      bedrooms: 5,
      bathrooms: 4,
      yearBuilt: 2021,
      furnishing: "furnished",
      amenities: ["pool", "garden", "parking", "security", "maid_room"],
      location: { city: "Cairo", district: "New Cairo", address: "Fifth Settlement", country: "Egypt" },
      images: [img("photo-1613490493576-7fde63acd811", "Villa exterior"), extra("photo-1600596542815-ffad4c1539a9", 1, "Pool")],
      owner: ownerId,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: { en: "Furnished Studio near Downtown", ar: "استوديو مفروش قرب وسط البلد" },
      description: {
        en: "Compact furnished studio ideal for professionals. Monthly rental.",
        ar: "استوديو مفروش مدمج مناسب للمهنيين. إيجار شهري.",
      },
      type: "studio",
      purpose: "rent",
      status: "published",
      price: 0,
      rentalPrice: 18000,
      currency: "EGP",
      area: 45,
      bedrooms: 0,
      bathrooms: 1,
      floor: 4,
      furnishing: "furnished",
      amenities: ["elevator", "wifi", "ac"],
      location: { city: "Cairo", district: "Downtown", address: "Talaat Harb", country: "Egypt" },
      images: [img("photo-1522708323590-d24dbb6b0267", "Studio")],
      owner: agentId,
      isFeatured: false,
      publishedAt: new Date(),
    },
    {
      title: { en: "Seafront Chalet in North Coast", ar: "شاليه على البحر في الساحل الشمالي" },
      description: {
        en: "Seasonal chalet steps from the beach. Perfect for summer stays.",
        ar: "شاليه موسمي على بعد خطوات من الشاطئ. مثالي لإقامات الصيف.",
      },
      type: "chalet",
      purpose: "rent",
      status: "published",
      price: 0,
      rentalPrice: 35000,
      currency: "EGP",
      area: 95,
      bedrooms: 2,
      bathrooms: 2,
      furnishing: "furnished",
      amenities: ["beach_access", "pool", "parking"],
      location: { city: "North Coast", district: "Sahel", address: "Marina", country: "Egypt" },
      images: [img("photo-1499793983690-e29da59b1c8b", "Chalet")],
      owner: ownerId,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: { en: "Investment Land Plot — Sheikh Zayed", ar: "قطعة أرض استثمارية — الشيخ زايد" },
      description: {
        en: "Prime residential plot suitable for development or long-term hold.",
        ar: "قطعة سكنية مميزة مناسبة للتطوير أو الاحتفاظ طويل الأجل.",
      },
      type: "land",
      purpose: "invest",
      status: "published",
      price: 9500000,
      currency: "EGP",
      area: 600,
      amenities: ["corner", "main_road"],
      location: { city: "Giza", district: "Sheikh Zayed", address: "Beverly Hills periphery", country: "Egypt" },
      images: [img("photo-1500382017468-9049fed747ef", "Land")],
      owner: ownerId,
      isFeatured: false,
      publishedAt: new Date(),
    },
    {
      title: { en: "Boutique Hotel Suites — Alexandria", ar: "أجنحة فندق بوتيك — الإسكندرية" },
      description: {
        en: "Boutique hotel rooms available for short stays with sea views.",
        ar: "غرف فندق بوتيك متاحة للإقامات القصيرة بإطلالة بحرية.",
      },
      type: "hotel",
      purpose: "both",
      status: "published",
      price: 45000000,
      rentalPrice: 2500,
      currency: "EGP",
      area: 1200,
      bedrooms: 24,
      bathrooms: 24,
      yearBuilt: 2018,
      furnishing: "furnished",
      amenities: ["restaurant", "wifi", "parking", "sea_view", "concierge"],
      location: { city: "Alexandria", district: "Corniche", address: "Stanley", country: "Egypt" },
      images: [img("photo-1566073771259-6a8506099945", "Hotel lobby"), extra("photo-1582719478250-c89cae4dc85b", 1, "Suite")],
      owner: hotelId,
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: { en: "Pending Review Penthouse", ar: "بنتهاوس قيد المراجعة" },
      description: {
        en: "Luxury penthouse submitted for admin review.",
        ar: "بنتهاوس فاخر مُرسل لمراجعة الإدارة.",
      },
      type: "penthouse",
      purpose: "sale",
      status: "pending",
      price: 32000000,
      currency: "EGP",
      area: 350,
      bedrooms: 4,
      bathrooms: 3,
      floor: 18,
      furnishing: "unfurnished",
      amenities: ["terrace", "elevator", "parking"],
      location: { city: "Cairo", district: "New Administrative Capital", address: "R3", country: "Egypt" },
      images: [img("photo-1600607687939-ce8a6c25118c", "Penthouse")],
      owner: ownerId,
      isFeatured: false,
    },
  ];

  const demoOwnerIds = [ownerId, agentId, hotelId].filter(Boolean);
  if (demoOwnerIds.length) {
    const del = await Property.deleteMany({
      owner: { $in: demoOwnerIds },
      "title.en": { $in: properties.map((p) => p.title.en) },
    });
    console.log(`Removed ${del.deletedCount} previous demo properties`);
  }

  for (const p of properties) {
    await Property.create(p);
    console.log(`Created property: ${p.title.en} [${p.status}]`);
  }

  console.log("\n✅ Seed complete");
  console.log("Demo password for all accounts:", DEMO_PASSWORD);
  console.log("Accounts:");
  for (const u of users) {
    console.log(`  - ${u.role.padEnd(14)} ${u.email}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
