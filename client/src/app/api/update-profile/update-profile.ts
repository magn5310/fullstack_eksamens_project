// app/api/profile/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstName, lastName, email, password } = body;

  // TODO: Get user ID from session (here we hardcode it for demo)
  const userId = "123"; 

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        password, // ⚠️ Remember to hash in real app
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, message: "Profile update failed" },
      { status: 500 }
    );
  }
}
