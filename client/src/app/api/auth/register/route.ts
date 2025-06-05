import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { hashPassword, generateToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validations/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    //zod validation
    const validatedData = registerSchema.parse(body);
    const { email, password, firstName, lastName } = validatedData;

    //check if user exist
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exist" }, { status: 409 });
    }

    //hash password
    const hashedPassword = await hashPassword(password);

    const userRole = await prisma.role.findUnique({
      where: { name: "User" },
    });

    if (!userRole) {
      return NextResponse.json({ error: "User role not found" }, { status: 500 });
    }

    //Create user in the database
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        roleId: userRole.id,
      },
      include: { role: true },
    });

    //generate JWT token
    const token = generateToken(user.id);

    //create response
    const response = NextResponse.json(
      {
        message: "User created sucessfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role.name,
        },
      },
      { status: 201 }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, //7 days
    };

    response.cookies.set("auth-token", token, cookieOptions);

    return response;
  } catch (error: unknown) {
    //zod errors
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
    //prisma errors
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "A user with that email already exist" },
        {
          status: 409,
        }
      );

    }

    console.log("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
