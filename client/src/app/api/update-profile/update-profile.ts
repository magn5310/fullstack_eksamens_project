import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyToken } from "@/lib/auth";


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

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                ...(body.password && { password: await hashPassword(body.password) }),
            },
        });

        return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 });
    }
}