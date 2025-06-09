import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { createRestaurantSchema } from "@/lib/validations/auth";
import { z } from "zod";

const prisma = new PrismaClient();

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

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generateUniqueSlug(baseName: string): Promise<string> {
  const slug = generateSlug(baseName);
  let counter = 0;

  while (true) {
    const testSlug = counter === 0 ? slug : `${slug}-${counter}`;

    const existing = await prisma.restaurant.findUnique({
      where: { slug: testSlug },
    });

    if (!existing) {
      return testSlug;
    }

    counter++;
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Must be logged in to create a restaurant" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createRestaurantSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    const slug = await generateUniqueSlug(validatedData.name);

    const restaurant = await prisma.restaurant.create({
      data: {
        name: validatedData.name,
        address: validatedData.address,
        slug: slug,
        description: validatedData.description,
        openHours: validatedData.openHours,
        phone: validatedData.phone,
        website: validatedData.website,
        ownerId: user.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json(
      {
        message: "Restaurant created",
        restaurant,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "Restaurant with that name already exist" }, { status: 409 });
    }

    console.error("Create restaurant error:", error);
    return NextResponse.json({ error: "An error happened creating your restaurant" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
