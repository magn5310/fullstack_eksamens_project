// /app/api/reviews/[restaurantId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest, context: { params: { restaurantId: string } }) {
  const { restaurantId } = context.params;

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

  try {
    const review = await prisma.review.create({
      data: {
        restaurantId: restaurantId,
        authorId: userId,
        tasteScore: body.tasteScore,
        serviceScore: body.serviceScore,
        priceScore: body.priceScore,
        comment: body.comment || "",
        title: body.title || "",
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ success: false, message: "Failed to create review" }, { status: 500 });
  }
}
