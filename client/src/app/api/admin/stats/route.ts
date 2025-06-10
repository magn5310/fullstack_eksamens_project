import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Verificer at brugeren er admin
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { role: true },
    });

    if (!user || user.role.name !== "Admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    // Hent statistikker parallelt for bedre performance
    const [totalUsers, activeUsers, totalReviews, pendingReviewsCount, pendingReviewsData, approvedReviews, approvedReviewsData, rejectedReviews, rejectedReviewsData, totalRestaurants, totalRestaurantsData] = await Promise.all([
      prisma.user.count(),

      // Aktive brugere (har skrevet mindst 1 review i de sidste 30 dage)
      prisma.user.count({
        where: {
          reviews: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Sidste 30 dage
              },
            },
          },
        },
      }),

      // Total antal reviews
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
        }
      })
       

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

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
