import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  
    try {
    const { id } = await params;
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    // Get the review
    const review = await prisma.review.findUnique({
      where: { id: id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if user owns the restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: review.restaurantId, ownerId: payload.userId },
    });

    if (!restaurant) {
      return NextResponse.json({ error: "You can only report reviews for your own restaurants" }, { status: 403 });
    }

    if (!review.reported) {
      const updatedReview = await prisma.review.update({
        where: { id: id },
        data: { reported: true, status: "PENDING" },
      });

      return NextResponse.json({
        success: true,
        message: "Review reported successfully",
        review: updatedReview,
      });
    } else {
      const updatedReview = await prisma.review.update({
        where: { id: id },
        data: { reported: false },
      });

      return NextResponse.json({
        success: true,
        message: "Review unreported successfully",
        review: updatedReview,
      });
    }
  } catch (error) {
    console.error("Error reporting review:", error);
    return NextResponse.json({ error: "Failed to report review" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
