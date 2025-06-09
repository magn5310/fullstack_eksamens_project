import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }

  const userId = decoded.userId;
  const body = await request.json();
  const { restaurantId, tasteScore, serviceScore, priceScore, comment, title } = body;

  if (!restaurantId) {
    return NextResponse.json({ success: false, message: "Missing restaurant ID" }, { status: 400 });
  }

  try {
    const review = await prisma.review.create({
      data: {
        restaurantId,
        authorId: userId,
        tasteScore,
        serviceScore,
        priceScore,
        comment: comment || "",
        title: title || "",
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ success: false, message: "Failed to create review" }, { status: 500 });
  }
}
