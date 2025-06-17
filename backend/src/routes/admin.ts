import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../lib/auth";

const router = Router();
const prisma = new PrismaClient();

// Middleware to check admin access
async function requireAdmin(req: Request, res: Response, next: any) {
  const token = req.cookies["auth-token"];

  if (!token) {
    res.status(401).json({ error: "No token found" });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { role: true },
  });

  if (!user || user.role.name !== "Admin") {
    res.status(403).json({ error: "Unauthorized - Admin access required" });
    return;
  }

  // Add user to request for later use
  (req as any).user = user;
  next();
}

// GET /api/admin/stats - Get admin statistics
router.get("/stats", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch statistics in parallel for better performance
    const [totalUsers, activeUsers, totalReviews, pendingReviewsCount, pendingReviewsData, approvedReviews, approvedReviewsData, rejectedReviews, rejectedReviewsData, totalRestaurants, totalRestaurantsData] = await Promise.all([
      prisma.user.count(),

      // Active users (wrote at least 1 review in last 30 days)
      prisma.user.count({
        where: {
          reviews: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          },
        },
      }),

      // Total reviews
      prisma.review.count(),

      prisma.review.count({
        where: {
          status: "PENDING",
          reported: true,
        },
      }),

      prisma.review.findMany({
        where: {
          status: "PENDING",
          reported: true,
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),

      prisma.review.count({
        where: {
          status: "APPROVED",
          reported: true,
        },
      }),

      prisma.review.findMany({
        where: {
          status: "APPROVED",
          reported: true,
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),

      prisma.review.count({
        where: {
          status: "REJECTED",
          reported: true,
        },
      }),

      prisma.review.findMany({
        where: {
          status: "REJECTED",
          reported: true,
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),

      prisma.restaurant.count(),

      prisma.restaurant.findMany({
        include: {
          reviews: {
            select: {
              id: true,
              title: true,
              status: true,
              createdAt: true,
            },
          },
        },
      }),
    ]);

    const stats = {
      totalUsers,
      activeUsers,
      pendingReviews: pendingReviewsCount,
      pendingReviewsData,
      approvedReviews,
      approvedReviewsData,
      rejectedReviews,
      rejectedReviewsData,
      totalRestaurants,
      totalRestaurantsData,
      totalReviews,
    };

    res.json(stats);
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
});

// PATCH /api/admin/review/:id - Update review status
router.patch("/review/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { status },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json({ success: true, review: updated });
  } catch (error) {
    console.error("Review status update error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
});

// DELETE /api/admin/restaurant/:id - Remove restaurant
router.delete("/restaurant/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Delete associated reviews first (to avoid foreign key constraints)
    await prisma.review.deleteMany({
      where: { restaurantId: id },
    });

    // Then delete the restaurant
    await prisma.restaurant.delete({
      where: { id },
    });

    res.json({ success: true, message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Restaurant deletion error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
