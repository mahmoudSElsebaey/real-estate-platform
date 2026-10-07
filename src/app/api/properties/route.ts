import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { getSession } from "@/lib/auth/session";
import { createPropertySchema } from "@/lib/properties/schemas";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    const { searchParams } = new URL(req.url);

    const mine = searchParams.get("mine") === "true";
    const status = searchParams.get("status");
    const purpose = searchParams.get("purpose");
    const type = searchParams.get("type");
    const city = searchParams.get("city");
    const q = searchParams.get("q")?.trim();
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "12", 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (mine) {
      if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      filter.owner = session.userId;
      if (status) filter.status = status;
    } else {
      filter.status = "published";
    }

    if (purpose) filter.purpose = purpose;
    if (type) filter.type = type;
    if (city) filter["location.city"] = new RegExp(city, "i");

    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      filter.price = priceFilter;
    }

    if (minArea || maxArea) {
      const areaFilter: Record<string, number> = {};
      if (minArea) areaFilter.$gte = Number(minArea);
      if (maxArea) areaFilter.$lte = Number(maxArea);
      filter.area = areaFilter;
    }

    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) filter.bathrooms = { $gte: Number(bathrooms) };

    if (q) {
      filter.$or = [
        { "title.en": { $regex: q, $options: "i" } },
        { "title.ar": { $regex: q, $options: "i" } },
        { "description.en": { $regex: q, $options: "i" } },
        { "description.ar": { $regex: q, $options: "i" } },
        { "location.city": { $regex: q, $options: "i" } },
        { "location.district": { $regex: q, $options: "i" } },
      ];
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sort) {
      case "price_asc": sortOption = { price: 1 }; break;
      case "price_desc": sortOption = { price: -1 }; break;
      case "area_desc": sortOption = { area: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    const [properties, total] = await Promise.all([
      Property.find(filter).sort(sortOption).skip(skip).limit(limit).populate("owner", "name email").lean(),
      Property.countDocuments(filter),
    ]);

    return NextResponse.json({
      properties,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    });
  } catch (error) {
    console.error("List properties error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const allowedRoles = ["owner", "agent", "hotel_operator", "admin"];
    if (!allowedRoles.includes(session.role)) {
      return NextResponse.json({ error: "You do not have permission to create listings" }, { status: 403 });
    }
    const body = await req.json();
    const parsed = createPropertySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }
    await connectDB();
    const data = parsed.data;
    if (data.images && data.images.length > 0) {
      const hasPrimary = data.images.some((img) => img.isPrimary);
      if (!hasPrimary) data.images[0].isPrimary = true;
    }
    const property = await Property.create({ ...data, owner: session.userId, status: data.status || "draft" });
    return NextResponse.json({ property: property.toObject() }, { status: 201 });
  } catch (error) {
    console.error("Create property error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
