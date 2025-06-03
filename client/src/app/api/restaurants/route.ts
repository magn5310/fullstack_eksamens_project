import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 3, // Kun de seneste 3 reviews
        },
      },
    });
    return NextResponse.json(restaurants);
  } catch {
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 });
  }
}
