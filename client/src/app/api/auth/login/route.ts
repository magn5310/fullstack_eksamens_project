import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyPassword, generateToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
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
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await generateToken(user.id);

    const response = NextResponse.json({
      message: "Login sucessful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        createdAt: user.createdAt.toISOString(),
        reviews: user.reviews.map((review) => ({
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

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error: ", error);
    return NextResponse.json({ error: "Error when tried to login" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
