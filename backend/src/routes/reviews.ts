import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../lib/auth";

const router = Router();
const prisma = new PrismaClient();

// POST /api/reviews - Create review
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

  const userId = decoded.userId;
  const body = req.body;
  const { restaurantId, tasteScore, serviceScore, priceScore, comment, title } = body;

  if (!restaurantId) {
    res.status(400).json({ success: false, message: "Missing restaurant ID" });
    return;
  }

  try {
    const review = await prisma.review.create({
      data: {
        restaurantId,
        authorId: userId,
        tasteScore,
        serviceScore,
        priceScore,
        comment: comment || "",
        title: title || "",
      },
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ success: false, message: "Failed to create review" });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
