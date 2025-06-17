import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyToken } from "../lib/auth";

const router = Router();
const prisma = new PrismaClient();

// POST /api/profile - Update profile
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies["auth-token"];

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ success: false, message: "Invalid token" });
    return;
  }

  const body = req.body;

  try {
    const updateData: any = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
    };

    // Only update password if provided
    if (body.password) {
      updateData.password = await hashPassword(body.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
    });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  } finally {
    await prisma.$disconnect();
  }
});

// GET /api/profile - Get profile data
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies["auth-token"];

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ success: false, message: "Invalid token" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user data" });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
