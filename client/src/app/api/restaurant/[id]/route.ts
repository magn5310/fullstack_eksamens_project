import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateRestaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  openHours: z.string().min(1, "Open hours are required"),
});

// PUT - Opdater restaurant data
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateRestaurantSchema.parse(body);

    // Verificer at restauranten eksisterer
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!existingRestaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // Opdater restauranten
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        address: validatedData.address,
        phone: validatedData.phone,
        website: validatedData.website,
        openHours: validatedData.openHours,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
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

    console.error("Update restaurant error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
