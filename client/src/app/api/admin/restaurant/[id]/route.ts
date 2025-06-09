import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Fix the parameter typing
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check admin
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { role: true },
    });
    if (!user || user.role.name !== "Admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    // Delete associated reviews first (to avoid foreign key constraints)
    await prisma.review.deleteMany({
      where: { restaurantId: params.id },
    });

    // Then delete the restaurant
    await prisma.restaurant.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Restaurant deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
