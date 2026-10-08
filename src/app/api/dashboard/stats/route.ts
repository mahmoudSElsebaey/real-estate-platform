import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import User from "@/models/User";
import Property from "@/models/Property";
import Favorite from "@/models/Favorite";
import Inquiry from "@/models/Inquiry";
import Booking from "@/models/Booking";
import InvestmentInterest from "@/models/InvestmentInterest";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const role = session.role;
    const userId = session.userId;

    if (role === "admin") {
      const [
        usersTotal,
        usersActive,
        propertiesTotal,
        pendingProperties,
        publishedProperties,
        suspendedProperties,
        inquiriesNew,
        bookingsPending,
        interestsNew,
        byRole,
        byStatus,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        Property.countDocuments(),
        Property.countDocuments({ status: "pending" }),
        Property.countDocuments({ status: "published" }),
        Property.countDocuments({ status: "suspended" }),
        Inquiry.countDocuments({ status: "new" }),
        Booking.countDocuments({ status: "pending" }),
        InvestmentInterest.countDocuments({ status: "new" }),
        User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
        Property.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      ]);

      return NextResponse.json({
        role,
        stats: {
          usersTotal,
          usersActive,
          propertiesTotal,
          pendingProperties,
          publishedProperties,
          suspendedProperties,
          inquiriesNew,
          bookingsPending,
          interestsNew,
        },
        charts: {
          usersByRole: Object.fromEntries(byRole.map((r) => [r._id, r.count])),
          propertiesByStatus: Object.fromEntries(
            byStatus.map((s) => [s._id, s.count])
          ),
        },
      });
    }

    if (["owner", "agent", "hotel_operator"].includes(role)) {
      const ownerFilter = { owner: userId };
      const myPropertyIds = await Property.find(ownerFilter).distinct("_id");
      const [
        listingsTotal,
        listingsPublished,
        listingsPending,
        listingsDraft,
        inboxInquiries,
        inboxInquiriesNew,
        inboxBookings,
        inboxBookingsPending,
        inboxInterests,
        inboxInterestsNew,
        favoritesOnMine,
      ] = await Promise.all([
        Property.countDocuments(ownerFilter),
        Property.countDocuments({ ...ownerFilter, status: "published" }),
        Property.countDocuments({ ...ownerFilter, status: "pending" }),
        Property.countDocuments({ ...ownerFilter, status: "draft" }),
        Inquiry.countDocuments({ propertyOwner: userId }),
        Inquiry.countDocuments({ propertyOwner: userId, status: "new" }),
        Booking.countDocuments({ propertyOwner: userId }),
        Booking.countDocuments({ propertyOwner: userId, status: "pending" }),
        InvestmentInterest.countDocuments({ propertyOwner: userId }),
        InvestmentInterest.countDocuments({
          propertyOwner: userId,
          status: "new",
        }),
        Favorite.countDocuments({ property: { $in: myPropertyIds } }),
      ]);

      const recentInquiries = await Inquiry.find({ propertyOwner: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("property", "title")
        .lean();

      const recentBookings = await Booking.find({ propertyOwner: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("property", "title")
        .populate("user", "name email")
        .lean();

      return NextResponse.json({
        role,
        stats: {
          listingsTotal,
          listingsPublished,
          listingsPending,
          listingsDraft,
          inboxInquiries,
          inboxInquiriesNew,
          inboxBookings,
          inboxBookingsPending,
          inboxInterests,
          inboxInterestsNew,
          favoritesOnMine,
        },
        recent: {
          inquiries: recentInquiries,
          bookings: recentBookings,
        },
      });
    }

    const [
      favorites,
      myInquiries,
      myBookings,
      myBookingsPending,
      myInterests,
      myInterestsNew,
    ] = await Promise.all([
      Favorite.countDocuments({ user: userId }),
      Inquiry.countDocuments({ user: userId }),
      Booking.countDocuments({ user: userId }),
      Booking.countDocuments({ user: userId, status: "pending" }),
      InvestmentInterest.countDocuments({ user: userId }),
      InvestmentInterest.countDocuments({ user: userId, status: "new" }),
    ]);

    const recentBookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("property", "title location images")
      .lean();

    const recentFavorites = await Favorite.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("property", "title location price currency images status")
      .lean();

    return NextResponse.json({
      role,
      stats: {
        favorites,
        myInquiries,
        myBookings,
        myBookingsPending,
        myInterests,
        myInterestsNew,
      },
      recent: {
        bookings: recentBookings,
        favorites: recentFavorites,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard stats" },
      { status: 500 }
    );
  }
}
