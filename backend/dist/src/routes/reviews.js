"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../lib/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// POST /api/reviews - Create review
router.post("/", async (req, res) => {
    const token = req.cookies["auth-token"];
    if (!token) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }
    const decoded = (0, auth_1.verifyToken)(token);
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
    }
    catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ success: false, message: "Failed to create review" });
    }
    finally {
        await prisma.$disconnect();
    }
});
exports.default = router;
