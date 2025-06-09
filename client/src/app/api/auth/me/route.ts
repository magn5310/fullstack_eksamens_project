import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


type ReviewWithRestaurant = {
  id: string;
  restaurantId: string;
  restaurant: {
    name: string;
    slug: string;
  };
  comment: string | null;
  createdAt: Date;
  tasteScore: number;
  serviceScore: number;
  priceScore: number;
  title: string;
};


export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        role: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          include: {
            restaurant: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        createdAt: user.createdAt.toISOString(),
        reviews: user.reviews.map((review: ReviewWithRestaurant) => ({
          id: review.id,
          restaurantId: review.restaurantId,
          restaurantName: review.restaurant.name,
          restaurantSlug: review.restaurant.slug,
          comment: review.comment,
          createdAt: review.createdAt.toISOString(),
          tasteScore: review.tasteScore,
          serviceScore: review.serviceScore,
          priceScore: review.priceScore,
          title: review.title,
        })),
      },
    });
    
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
