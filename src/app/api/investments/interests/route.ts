import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import InvestmentInterest from "@/models/InvestmentInterest";
import Property from "@/models/Property";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

const createSchema = z.object({
  propertyId: z.string().min(1),
  proposedAmount: z.coerce.number().min(0).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
});

// GET /api/investments/interests?scope=mine|inbox
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") || "mine";

    await connectDB();

    const filter: Record<string, unknown> = {};
    if (scope === "inbox") {
      filter.propertyOwner = session.userId;
    } else {
      filter.user = session.userId;
    }

    const interests = await InvestmentInterest.find(filter)
      .sort({ createdAt: -1 })
      .populate(
        "property",
        "title type purpose price currency location images status"
      )
      .populate("user", "name email phone")
      .lean();

    return NextResponse.json({ interests });
  } catch (error) {
    console.error("List investment interests error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/investments/interests
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const property = await Property.findById(parsed.data.propertyId);
    if (!property || property.status === "archived") {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (!["invest", "both"].includes(property.purpose)) {
      return NextResponse.json(
        { error: "Property is not an investment opportunity" },
        { status: 400 }
      );
    }

    const interest = await InvestmentInterest.create({
      property: property._id,
      propertyOwner: property.owner,
      user: session.userId,
      proposedAmount: parsed.data.proposedAmount || undefined,
      message: parsed.data.message || undefined,
      status: "new",
    });

    return NextResponse.json(
      { interest: interest.toObject() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create investment interest error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
