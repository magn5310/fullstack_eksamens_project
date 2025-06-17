"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = PUT;
const server_1 = require("next/server");
const auth_1 = require("@/lib/auth");
const prisma_1 = require("@/lib/prisma");
async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const token = request.cookies.get("auth-token")?.value;
        if (!token) {
            return server_1.NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        const payload = (0, auth_1.verifyToken)(token);
        if (!payload) {
            return server_1.NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        // Get the review
        const review = await prisma_1.prisma.review.findUnique({
            where: { id: id },
        });
        if (!review) {
            return server_1.NextResponse.json({ error: "Review not found" }, { status: 404 });
        }
        // Check if user owns the restaurant
        const restaurant = await prisma_1.prisma.restaurant.findUnique({
            where: { id: review.restaurantId, ownerId: payload.userId },
        });
        if (!restaurant) {
            return server_1.NextResponse.json({ error: "You can only report reviews for your own restaurants" }, { status: 403 });
        }
        if (!review.reported) {
            const updatedReview = await prisma_1.prisma.review.update({
                where: { id: id },
                data: { reported: true, status: "PENDING" },
            });
            return server_1.NextResponse.json({
                success: true,
                message: "Review reported successfully",
                review: updatedReview,
            });
        }
        else {
            const updatedReview = await prisma_1.prisma.review.update({
                where: { id: id },
                data: { reported: false },
            });
            return server_1.NextResponse.json({
                success: true,
                message: "Review unreported successfully",
                review: updatedReview,
            });
        }
    }
    catch (error) {
        console.error("Error reporting review:", error);
        return server_1.NextResponse.json({ error: "Failed to report review" }, { status: 500 });
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
}
//# sourceMappingURL=route.js.map