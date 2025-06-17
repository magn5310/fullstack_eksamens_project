"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../lib/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// POST /api/profile - Update profile
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
    const body = req.body;
    try {
        const updateData = {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
        };
        // Only update password if provided
        if (body.password) {
            updateData.password = await (0, auth_1.hashPassword)(body.password);
        }
        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: updateData,
        });
        res.json({ success: true, user: updatedUser });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
    finally {
        await prisma.$disconnect();
    }
});
// GET /api/profile - Get profile data
router.get("/", async (req, res) => {
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
    }
    catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ success: false, message: "Failed to fetch user data" });
    }
    finally {
        await prisma.$disconnect();
    }
});
exports.default = router;
