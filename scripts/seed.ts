/**
 * Demo seed script for Aqarco
 * Usage: npm run seed
 * Requires MONGODB_URI in .env.local
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Set it in .env.local");
  process.exit(1);
}

const DEMO_PASSWORD = "Demo@12345";

const users = [
  { name: "Admin Aqarco", email: "admin@aqarco.demo", role: "admin", phone: "+201000000001", preferredLocale: "en", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=85" },
  { name: "Omar Owner", email: "owner@aqarco.demo", role: "owner", phone: "+201000000002", preferredLocale: "ar", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=85" },
  { name: "Sara Agent", email: "agent@aqarco.demo", role: "agent", phone: "+201000000003", preferredLocale: "en", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=85" },
  { name: "Layla Investor", email: "investor@aqarco.demo", role: "investor", phone: "+201000000004", preferredLocale: "en", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=85" },
  { name: "Hassan Buyer", email: "buyer@aqarco.demo", role: "buyer", phone: "+201000000005", preferredLocale: "ar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=85" },
  { name: "Nour Renter", email: "renter@aqarco.demo", role: "renter", phone: "+201000000006", preferredLocale: "en", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=85" },
  { name: "Hotel Nile", email: "hotel@aqarco.demo", role: "hotel_operator", phone: "+201000000007", preferredLocale: "en", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=85" },
] as const;

const image = (id: string, alt: string, order = 0, isPrimary = order === 0) => ({
  url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=85`,
  isPrimary,
  order,
  alt,
});

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);

  const UserSchema = new mongoose.Schema({
    name: String, email: { type: String, unique: true }, password: String, role: String,
    phone: String, avatar: String, preferredLocale: { type: String, default: "en" },
    isVerified: { type: Boolean, default: true }, isActive: { type: Boolean, default: true },
  }, { timestamps: true });

  const PropertySchema = new mongoose.Schema({
    title: { en: String, ar: String }, description: { en: String, ar: String },
    type: String, purpose: String, status: String, price: Number, rentalPrice: Number,
    currency: { type: String, default: "EGP" }, area: Number, bedrooms: Number, bathrooms: Number,
    floor: Number, totalFloors: Number, yearBuilt: Number, furnishing: String, amenities: [String],
    location: { city: String, district: String, address: String, country: String },
    images: [{ url: String, publicId: String, isPrimary: Boolean, order: Number, alt: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, isFeatured: Boolean,
    views: { type: Number, default: 0 }, publishedAt: Date,
  }, { timestamps: true });

  const BookingSchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    propertyOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    checkIn: Date, checkOut: Date, guests: Number, message: String, status: String,
    estimatedTotal: Number, currency: String, notes: String,
  }, { timestamps: true });

  const FavoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  }, { timestamps: true });

  const InquirySchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    propertyOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String, email: String, phone: String, type: String, message: String,
    preferredDate: Date, status: String, notes: String,
  }, { timestamps: true });

  const InvestmentInterestSchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    propertyOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    proposedAmount: Number, message: String, status: String, notes: String,
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Property = mongoose.models.Property || mongoose.model("Property", PropertySchema);
  const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
  const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);
  const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
  const InvestmentInterest = mongoose.models.InvestmentInterest || mongoose.model("InvestmentInterest", InvestmentInterestSchema);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const createdUsers: Record<string, mongoose.Types.ObjectId> = {};

  for (const u of users) {
    const doc = await User.findOneAndUpdate(
      { email: u.email },
      { ...u, password: passwordHash, isVerified: true, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    createdUsers[u.email] = doc._id;
  }

  const ownerId = createdUsers["owner@aqarco.demo"];
  const agentId = createdUsers["agent@aqarco.demo"];
  const hotelId = createdUsers["hotel@aqarco.demo"];
  const buyerId = createdUsers["buyer@aqarco.demo"];
  const renterId = createdUsers["renter@aqarco.demo"];
  const investorId = createdUsers["investor@aqarco.demo"];

  const properties = [
    {
      title: { en: "Nile View Apartment in Zamalek", ar: "شقة بإطلالة على النيل في الزمالك" },
      description: { en: "Bright 3-bedroom apartment overlooking the Nile with modern finishes and balcony.", ar: "شقة مشرقة من 3 غرف تطل على النيل بتشطيبات حديثة وشرفة." },
      type: "apartment", purpose: "sale", status: "published", price: 12500000, currency: "EGP", area: 180, bedrooms: 3, bathrooms: 2,
      floor: 8, totalFloors: 12, yearBuilt: 2019, furnishing: "semi_furnished", amenities: ["elevator", "balcony", "security", "parking"],
      location: { city: "Cairo", district: "Zamalek", address: "26th of July Street", country: "Egypt" },
      images: [image("photo-1502672260266-1c1ef2d93688", "Living room"), image("photo-1560448204-e02f11c3d0e2", "Bedroom", 1, false)],
      owner: ownerId, isFeatured: true, views: 842, publishedAt: new Date(),
    },
    {
      title: { en: "Garden Villa in New Cairo", ar: "فيلا بحديقة في القاهرة الجديدة" },
      description: { en: "Spacious family villa with private garden, pool, and smart home system.", ar: "فيلا عائلية واسعة بحديقة خاصة ومسبح ونظام منزل ذكي." },
      type: "villa", purpose: "sale", status: "published", price: 28000000, currency: "EGP", area: 420, bedrooms: 5, bathrooms: 4,
      yearBuilt: 2021, furnishing: "furnished", amenities: ["pool", "garden", "parking", "security", "maid_room"],
      location: { city: "Cairo", district: "New Cairo", address: "Fifth Settlement", country: "Egypt" },
      images: [image("photo-1613490493576-7fde63acd811", "Villa exterior"), image("photo-1600596542815-ffad4c1539a9", "Pool", 1, false)],
      owner: ownerId, isFeatured: true, views: 621, publishedAt: new Date(),
    },
    {
      title: { en: "Furnished Studio near Downtown", ar: "استوديو مفروش قرب وسط البلد" },
      description: { en: "Compact furnished studio ideal for professionals. Monthly rental.", ar: "استوديو مفروش مدمج مناسب للمهنيين. إيجار شهري." },
      type: "studio", purpose: "rent", status: "published", price: 0, rentalPrice: 18000, currency: "EGP", area: 45, bedrooms: 0, bathrooms: 1,
      floor: 4, furnishing: "furnished", amenities: ["elevator", "wifi", "ac"],
      location: { city: "Cairo", district: "Downtown", address: "Talaat Harb", country: "Egypt" },
      images: [image("photo-1522708323590-d24dbb6b0267", "Studio")], owner: agentId, isFeatured: false, views: 294, publishedAt: new Date(),
    },
    {
      title: { en: "Seafront Chalet in North Coast", ar: "شاليه على البحر في الساحل الشمالي" },
      description: { en: "Seasonal chalet steps from the beach. Perfect for summer stays.", ar: "شاليه موسمي على بعد خطوات من الشاطئ. مثالي لإقامات الصيف." },
      type: "chalet", purpose: "rent", status: "published", price: 0, rentalPrice: 35000, currency: "EGP", area: 95, bedrooms: 2, bathrooms: 2,
      furnishing: "furnished", amenities: ["beach_access", "pool", "parking"],
      location: { city: "North Coast", district: "Sahel", address: "Marina", country: "Egypt" },
      images: [image("photo-1499793983690-e29da59b1c8b", "Chalet")], owner: ownerId, isFeatured: true, views: 477, publishedAt: new Date(),
    },
    {
      title: { en: "Investment Land Plot — Sheikh Zayed", ar: "قطعة أرض استثمارية — الشيخ زايد" },
      description: { en: "Prime residential plot suitable for development or long-term hold.", ar: "قطعة سكنية مميزة مناسبة للتطوير أو الاحتفاظ طويل الأجل." },
      type: "land", purpose: "invest", status: "published", price: 9500000, currency: "EGP", area: 600,
      amenities: ["corner", "main_road"], location: { city: "Giza", district: "Sheikh Zayed", address: "Beverly Hills periphery", country: "Egypt" },
      images: [image("photo-1500382017468-9049fed747ef", "Land")], owner: ownerId, isFeatured: true, views: 315, publishedAt: new Date(),
    },
    {
      title: { en: "Boutique Hotel Suites — Alexandria", ar: "أجنحة فندق بوتيك — الإسكندرية" },
      description: { en: "Boutique hotel rooms available for short stays with sea views.", ar: "غرف فندق بوتيك متاحة للإقامات القصيرة بإطلالة بحرية." },
      type: "hotel", purpose: "both", status: "published", price: 45000000, rentalPrice: 2500, currency: "EGP", area: 1200, bedrooms: 24, bathrooms: 24,
      yearBuilt: 2018, furnishing: "furnished", amenities: ["restaurant", "wifi", "parking", "sea_view", "concierge"],
      location: { city: "Alexandria", district: "Corniche", address: "Stanley", country: "Egypt" },
      images: [image("photo-1566073771259-6a8506099945", "Hotel lobby"), image("photo-1582719478250-c89cae4dc85b", "Suite", 1, false)],
      owner: hotelId, isFeatured: true, views: 732, publishedAt: new Date(),
    },
    {
      title: { en: "Pending Review Penthouse", ar: "بنتهاوس قيد المراجعة" },
      description: { en: "Luxury penthouse submitted for admin review.", ar: "بنتهاوس فاخر مُرسل لمراجعة الإدارة." },
      type: "penthouse", purpose: "sale", status: "pending", price: 32000000, currency: "EGP", area: 350, bedrooms: 4, bathrooms: 3,
      floor: 18, furnishing: "unfurnished", amenities: ["terrace", "elevator", "parking"],
      location: { city: "Cairo", district: "New Administrative Capital", address: "R3", country: "Egypt" },
      images: [image("photo-1600607687939-ce8a6c25118c", "Penthouse")], owner: ownerId, isFeatured: false, views: 48,
    },
    {
      title: { en: "Modern Apartment Investment — October", ar: "شقة استثمارية حديثة — أكتوبر" },
      description: { en: "High-demand apartment suitable for rental income and long-term appreciation.", ar: "شقة في منطقة مرتفعة الطلب مناسبة للدخل الإيجاري والنمو طويل الأجل." },
      type: "apartment", purpose: "both", status: "published", price: 7800000, rentalPrice: 42000, currency: "EGP", area: 165, bedrooms: 3, bathrooms: 2,
      floor: 6, totalFloors: 10, yearBuilt: 2022, furnishing: "semi_furnished", amenities: ["parking", "security", "elevator", "balcony"],
      location: { city: "Giza", district: "6th of October", address: "Palm Parks", country: "Egypt" },
      images: [image("photo-1600607687920-4e2a09cf159d", "Investment apartment"), image("photo-1600607688969-a5bfcd646154", "Apartment interior", 1, false)],
      owner: agentId, isFeatured: true, views: 408, publishedAt: new Date(),
    },
  ];

  const demoOwnerIds = [ownerId, agentId, hotelId].filter(Boolean);
  await Property.deleteMany({ owner: { $in: demoOwnerIds } });
  const propertyDocs = await Property.insertMany(properties);
  const byTitle = new Map(propertyDocs.map((p: any) => [p.title.en, p]));

  await Booking.deleteMany({ $or: [{ user: { $in: [buyerId, renterId] } }, { propertyOwner: { $in: demoOwnerIds } }] });
  await Favorite.deleteMany({ user: { $in: [buyerId, renterId, investorId] } });
  await Inquiry.deleteMany({ $or: [{ user: { $in: [buyerId, renterId] } }, { propertyOwner: { $in: demoOwnerIds } }] });
  await InvestmentInterest.deleteMany({ $or: [{ user: investorId }, { propertyOwner: { $in: demoOwnerIds } }] });

  const apartment = byTitle.get("Nile View Apartment in Zamalek")!;
  const villa = byTitle.get("Garden Villa in New Cairo")!;
  const studio = byTitle.get("Furnished Studio near Downtown")!;
  const chalet = byTitle.get("Seafront Chalet in North Coast")!;
  const land = byTitle.get("Investment Land Plot — Sheikh Zayed")!;
  const hotel = byTitle.get("Boutique Hotel Suites — Alexandria")!;
  const investApartment = byTitle.get("Modern Apartment Investment — October")!;

  await Favorite.insertMany([
    { user: buyerId, property: apartment._id },
    { user: buyerId, property: villa._id },
    { user: buyerId, property: investApartment._id },
    { user: renterId, property: studio._id },
    { user: renterId, property: chalet._id },
    { user: investorId, property: land._id },
  ]);

  const now = new Date();
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 86400000);

  await Booking.insertMany([
    { property: chalet._id, propertyOwner: chalet.owner, user: renterId, checkIn: daysFromNow(18), checkOut: daysFromNow(23), guests: 3, message: "Looking forward to a quiet family stay.", status: "confirmed", estimatedTotal: 175000, currency: "EGP" },
    { property: hotel._id, propertyOwner: hotel.owner, user: renterId, checkIn: daysFromNow(35), checkOut: daysFromNow(38), guests: 2, message: "Sea-view suite requested.", status: "pending", estimatedTotal: 7500, currency: "EGP" },
    { property: studio._id, propertyOwner: studio.owner, user: buyerId, checkIn: daysFromNow(50), checkOut: daysFromNow(80), guests: 1, message: "Interested in a monthly stay.", status: "completed", estimatedTotal: 540000, currency: "EGP" },
  ]);

  await Inquiry.insertMany([
    { property: apartment._id, propertyOwner: apartment.owner, user: buyerId, name: "Hassan Buyer", email: "buyer@aqarco.demo", phone: "+201000000005", type: "visit", message: "I would like to schedule a viewing this weekend.", preferredDate: daysFromNow(5), status: "new" },
    { property: villa._id, propertyOwner: villa.owner, user: renterId, name: "Nour Renter", email: "renter@aqarco.demo", phone: "+201000000006", type: "info", message: "Can you share more details about the garden and service fees?", status: "in_progress" },
    { property: hotel._id, propertyOwner: hotel.owner, user: buyerId, name: "Hassan Buyer", email: "buyer@aqarco.demo", phone: "+201000000005", type: "offer", message: "Interested in the hotel as a long-term investment.", status: "contacted" },
  ]);

  await InvestmentInterest.insertMany([
    { property: land._id, propertyOwner: land.owner, user: investorId, proposedAmount: 9000000, message: "I would like to discuss the development potential and expected ROI.", status: "new" },
    { property: investApartment._id, propertyOwner: investApartment.owner, user: investorId, proposedAmount: 7600000, message: "Please send rental yield and management details.", status: "contacted" },
    { property: hotel._id, propertyOwner: hotel.owner, user: investorId, proposedAmount: 42000000, message: "Interested in a partnership or acquisition discussion.", status: "closed", notes: "Demo closed lead" },
  ]);

  console.log("\n✅ Seed complete");
  console.log("Demo password for all accounts:", DEMO_PASSWORD);
  console.log("Seeded: users, properties, favorites, bookings, inquiries, investment interests.");
  for (const u of users) console.log(`  - ${u.role.padEnd(14)} ${u.email}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
