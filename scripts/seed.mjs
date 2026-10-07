import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required in .env.local");
}

const DEMO_PASSWORD = "Demo@12345";

const roles = [
  ["buyer", "Demo Buyer", "demo.buyer@aether.test"],
  ["renter", "Demo Renter", "demo.renter@aether.test"],
  ["investor", "Demo Investor", "demo.investor@aether.test"],
  ["owner", "Demo Owner", "demo.owner@aether.test"],
  ["agent", "Demo Agent", "demo.agent@aether.test"],
  ["hotel_operator", "Demo Hotel Operator", "demo.hotel@aether.test"],
  ["admin", "Demo Admin", "demo.admin@aether.test"],
];

const propertyData = [
  {
    key: "nile-view-penthouse",
    title: { en: "Nile View Penthouse", ar: "بنتهاوس بإطلالة على النيل" },
    description: { en: "A refined penthouse with panoramic Nile views, generous entertaining spaces, and premium finishes.", ar: "بنتهاوس راقٍ بإطلالة بانورامية على النيل ومساحات واسعة وتشطيبات فاخرة." },
    type: "penthouse", purpose: "sale", status: "published", price: 18500000, currency: "EGP", area: 320, bedrooms: 4, bathrooms: 4, floor: 18, totalFloors: 20, yearBuilt: 2023, furnishing: "furnished",
    amenities: ["Nile view", "Private terrace", "Parking", "Security", "Elevator", "Smart home"],
    location: { city: "Cairo", district: "Zamalek", address: "Nile Corniche", country: "Egypt", coordinates: { lat: 30.0616, lng: 31.2194 } },
    images: [
      { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80", isPrimary: true, order: 0, alt: "Luxury penthouse living room" },
      { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80", isPrimary: false, order: 1, alt: "Modern bedroom" },
    ],
    isFeatured: true, views: 248,
  },
  {
    key: "new-cairo-villa",
    title: { en: "Contemporary Garden Villa", ar: "فيلا عصرية بحديقة خاصة" },
    description: { en: "A contemporary family villa with a private garden, spacious interiors, and quiet residential surroundings.", ar: "فيلا عائلية عصرية بحديقة خاصة ومساحات داخلية واسعة في منطقة سكنية هادئة." },
    type: "villa", purpose: "sale", status: "published", price: 12500000, currency: "EGP", area: 410, bedrooms: 5, bathrooms: 5, floor: 0, totalFloors: 2, yearBuilt: 2022, furnishing: "semi_furnished",
    amenities: ["Private garden", "Garage", "Maid room", "Security", "Club access"],
    location: { city: "Cairo", district: "New Cairo", address: "Fifth Settlement", country: "Egypt" },
    images: [
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80", isPrimary: true, order: 0, alt: "Contemporary villa exterior" },
      { url: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1600&q=80", isPrimary: false, order: 1, alt: "Villa interior" },
    ],
    isFeatured: true, views: 191,
  },
  {
    key: "north-coast-chalet",
    title: { en: "North Coast Sea View Chalet", ar: "شاليه بإطلالة بحرية في الساحل الشمالي" },
    description: { en: "A turnkey summer retreat steps from the sea, designed for family holidays and seasonal rental income.", ar: "ملاذ صيفي جاهز بالقرب من البحر، مناسب للعطلات العائلية وعوائد الإيجار الموسمية." },
    type: "chalet", purpose: "both", status: "published", price: 6500000, rentalPrice: 85000, currency: "EGP", area: 165, bedrooms: 3, bathrooms: 2, floor: 2, totalFloors: 3, yearBuilt: 2024, furnishing: "furnished",
    amenities: ["Sea view", "Beach access", "Pool", "Air conditioning", "Parking"],
    location: { city: "North Coast", district: "Sidi Abdel Rahman", address: "North Coast", country: "Egypt" },
    images: [
      { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80", isPrimary: true, order: 0, alt: "Luxury coastal residence" },
      { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80", isPrimary: false, order: 1, alt: "Chalet interior" },
    ],
    isFeatured: true, views: 327,
  },
  {
    key: "alexandria-rental",
    title: { en: "Stanley Seafront Apartment", ar: "شقة على البحر في ستانلي" },
    description: { en: "Bright furnished apartment overlooking the Mediterranean, ideal for long-term executive rental.", ar: "شقة مفروشة مشرقة بإطلالة على البحر المتوسط، مثالية للإيجار طويل المدى." },
    type: "apartment", purpose: "rent", status: "published", price: 0, rentalPrice: 55000, currency: "EGP", area: 145, bedrooms: 3, bathrooms: 2, floor: 7, totalFloors: 12, yearBuilt: 2021, furnishing: "furnished",
    amenities: ["Sea view", "Elevator", "Security", "Parking", "Central air"],
    location: { city: "Alexandria", district: "Stanley", address: "Corniche Road", country: "Egypt" },
    images: [{ url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80", isPrimary: true, order: 0, alt: "Seafront apartment" }],
    isFeatured: false, views: 142,
  },
  {
    key: "administrative-office",
    title: { en: "Premium Business Office", ar: "مكتب إداري فاخر" },
    description: { en: "Turnkey office space in a premium business district, suitable for a growing professional team.", ar: "مساحة مكتبية جاهزة في منطقة أعمال مميزة، مناسبة لفريق مهني متنامٍ." },
    type: "office", purpose: "rent", status: "published", price: 0, rentalPrice: 95000, currency: "EGP", area: 210, bathrooms: 2, floor: 9, totalFloors: 18, yearBuilt: 2023, furnishing: "furnished",
    amenities: ["Reception", "Meeting room", "Parking", "Security", "High-speed internet"],
    location: { city: "Cairo", district: "New Capital", address: "Business District", country: "Egypt" },
    images: [{ url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80", isPrimary: true, order: 0, alt: "Premium office interior" }],
    isFeatured: false, views: 88,
  },
  {
    key: "investment-compound",
    title: { en: "Boutique Residential Investment", ar: "فرصة استثمارية سكنية مميزة" },
    description: { en: "A high-demand residential unit positioned for long-term appreciation and rental yield.", ar: "وحدة سكنية في منطقة مرتفعة الطلب، مناسبة للنمو الرأسمالي وعائد الإيجار." },
    type: "apartment", purpose: "invest", status: "published", price: 4800000, currency: "EGP", area: 125, bedrooms: 2, bathrooms: 2, floor: 5, totalFloors: 10, yearBuilt: 2025, furnishing: "unfurnished",
    amenities: ["Clubhouse", "Pool", "Gym", "Security", "Parking"],
    location: { city: "Cairo", district: "Mostakbal City", address: "Residential District", country: "Egypt" },
    images: [{ url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80", isPrimary: true, order: 0, alt: "Investment apartment" }],
    isFeatured: true, views: 116,
  },
  {
    key: "luxury-resort-suite",
    title: { en: "Boutique Resort Suite", ar: "جناح فاخر في منتجع" },
    description: { en: "A hospitality-ready suite in a resort setting, suitable for short stays and managed rental operations.", ar: "جناح جاهز للتشغيل الفندقي داخل منتجع، مناسب للإقامات القصيرة والتأجير المُدار." },
    type: "resort", purpose: "invest", status: "published", price: 7200000, rentalPrice: 120000, currency: "EGP", area: 180, bedrooms: 2, bathrooms: 2, floor: 3, totalFloors: 6, yearBuilt: 2024, furnishing: "furnished",
    amenities: ["Beach access", "Pool", "Spa", "Housekeeping", "Restaurant", "Parking"],
    location: { city: "Hurghada", district: "Sahl Hasheesh", address: "Resort District", country: "Egypt" },
    images: [{ url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&q=80", isPrimary: true, order: 0, alt: "Resort suite" }],
    isFeatured: true, views: 204,
  },
  {
    key: "draft-owner-listing",
    title: { en: "Owner Listing - Pending Review", ar: "عقار مالك - قيد المراجعة" },
    description: { en: "Demo listing used to test the owner submission and moderation workflow.", ar: "عقار تجريبي لاختبار دورة إضافة العقار ومراجعته من الإدارة." },
    type: "townhouse", purpose: "sale", status: "pending", price: 8900000, currency: "EGP", area: 260, bedrooms: 4, bathrooms: 3, floor: 0, totalFloors: 2, yearBuilt: 2024, furnishing: "semi_furnished",
    amenities: ["Garden", "Garage", "Security", "Club access"],
    location: { city: "Cairo", district: "Madinaty", address: "Garden District", country: "Egypt" },
    images: [{ url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=80", isPrimary: true, order: 0, alt: "Townhouse exterior" }],
    isFeatured: false, views: 24,
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI);

  const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true },
    phone: String,
    avatar: String,
    preferredLocale: { type: String, default: "en" },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  }, { timestamps: true }));

  const Property = mongoose.models.Property || mongoose.model("Property", new mongoose.Schema({
    title: { en: String, ar: String }, description: { en: String, ar: String },
    type: String, purpose: String, status: String, price: Number, rentalPrice: Number, currency: String,
    area: Number, bedrooms: Number, bathrooms: Number, floor: Number, totalFloors: Number, yearBuilt: Number,
    furnishing: String, amenities: [String], location: { city: String, district: String, address: String, country: String, coordinates: { lat: Number, lng: Number } },
    images: [{ url: String, publicId: String, isPrimary: Boolean, order: Number, alt: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, agent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isFeatured: Boolean, views: Number, rejectionReason: String, publishedAt: Date,
  }, { timestamps: true }));

  const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  }, { timestamps: true }));

  const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry", new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    propertyOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String, email: String, phone: String, type: String, message: String, preferredDate: Date, status: String, notes: String,
  }, { timestamps: true }));

  const password = await bcrypt.hash(DEMO_PASSWORD, 12);
  const users = new Map();

  for (const [role, name, email] of roles) {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { name, password, role, preferredLocale: "en", isVerified: true, isActive: true } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    users.set(role, user);
  }

  const owner = users.get("owner");
  const agent = users.get("agent");
  const buyer = users.get("buyer");
  const renter = users.get("renter");

  const properties = new Map();
  for (const item of propertyData) {
    const existing = await Property.findOne({ "title.en": item.title.en });
    const doc = existing
      ? await Property.findByIdAndUpdate(existing._id, { ...item, owner: owner._id, agent: agent._id, publishedAt: item.status === "published" ? (existing.publishedAt || new Date()) : existing.publishedAt }, { new: true })
      : await Property.create({ ...item, owner: owner._id, agent: agent._id, publishedAt: item.status === "published" ? new Date() : undefined });
    properties.set(item.key, doc);
  }

  await Favorite.deleteMany({ user: { $in: [buyer._id, renter._id] }, property: { $in: [...properties.values()].map((p) => p._id) } });
  await Favorite.insertMany([
    { user: buyer._id, property: properties.get("nile-view-penthouse")._id },
    { user: buyer._id, property: properties.get("investment-compound")._id },
    { user: renter._id, property: properties.get("alexandria-rental")._id },
    { user: renter._id, property: properties.get("north-coast-chalet")._id },
  ]);

  await Inquiry.deleteMany({ user: { $in: [buyer._id, renter._id] }, property: { $in: [...properties.values()].map((p) => p._id) } });
  await Inquiry.insertMany([
    { property: properties.get("nile-view-penthouse")._id, propertyOwner: owner._id, user: buyer._id, name: buyer.name, email: buyer.email, phone: "+20 100 000 0001", type: "visit", message: "I would like to schedule a private viewing.", preferredDate: new Date(Date.now() + 3 * 86400000), status: "new" },
    { property: properties.get("alexandria-rental")._id, propertyOwner: owner._id, user: renter._id, name: renter.name, email: renter.email, phone: "+20 100 000 0002", type: "info", message: "Is the apartment available for a 12-month lease?", status: "in_progress", notes: "Demo inquiry for owner inbox." },
  ]);

  console.log("\nSeed completed successfully.");
  console.log(`Demo password: ${DEMO_PASSWORD}`);
  console.table(roles.map(([role, name, email]) => ({ role, name, email, password: DEMO_PASSWORD })));
  console.log(`Properties: ${properties.size}`);
  console.log("Favorites: 4 | Inquiries: 2");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
