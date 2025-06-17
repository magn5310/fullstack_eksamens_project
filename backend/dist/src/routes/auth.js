"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../lib/auth");
const auth_2 = require("../lib/validations/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Login endpoint - med korrekte Express typer
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
                reviews: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        restaurant: {
                            select: {
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
                restaurants: {
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        address: true,
                        createdAt: true,
                        description: true,
                        phone: true,
                        website: true,
                        openHours: true,
                        reviews: {
                            select: {
                                id: true,
                                tasteScore: true,
                                serviceScore: true,
                                priceScore: true,
                                comment: true,
                                title: true,
                                createdAt: true,
                                restaurantId: true,
                                author: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const isValidPassword = await (0, auth_1.verifyPassword)(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = await (0, auth_1.generateToken)(user.id);
        // Set cookie
        res.cookie("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
        });
        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role.name,
                createdAt: user.createdAt.toISOString(),
                reviews: user.reviews.map((review) => ({
                    id: review.id,
                    restaurantId: review.restaurantId,
                    restaurantName: review.restaurant.name,
                    restaurantSlug: review.restaurant.slug,
                    comment: review.comment,
                    createdAt: review.createdAt.toISOString(),
                    tasteScore: review.tasteScore,
                    serviceScore: review.serviceScore,
                    priceScore: review.priceScore,
                    title: review.title,
                })),
                restaurants: user.restaurants.map((restaurant) => ({
                    id: restaurant.id,
                    name: restaurant.name,
                    slug: restaurant.slug,
                    description: restaurant.description,
                    address: restaurant.address,
                    phone: restaurant.phone,
                    website: restaurant.website,
                    openHours: restaurant.openHours,
                    createdAt: restaurant.createdAt.toISOString(),
                    reviews: restaurant.reviews.map((review) => ({
                        id: review.id,
                        restaurantId: review.restaurantId,
                        comment: review.comment,
                        createdAt: review.createdAt.toISOString(),
                        tasteScore: review.tasteScore,
                        serviceScore: review.serviceScore,
                        priceScore: review.priceScore,
                        title: review.title,
                        author: review.author,
                    })),
                })),
            },
        });
    }
    catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({ error: "Error when tried to login" });
    }
    finally {
        await prisma.$disconnect();
    }
});
// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const body = req.body;
        // Zod validation
        const validatedData = auth_2.registerSchema.parse(body);
        const { email, password, firstName, lastName } = validatedData;
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({
                error: "User already exist",
                message: "A user with this email already exists",
                code: "USER_EXISTS"
            });
            return;
        }
        // Hash password
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const userRole = await prisma.role.findUnique({
            where: { name: "User" },
        });
        if (!userRole) {
            res.status(500).json({ error: "User role not found" });
            return;
        }
        // Create user
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
        // Generate JWT token
        const token = (0, auth_1.generateToken)(user.id);
        // Set cookie
        res.cookie('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
        });
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role.name,
            },
        });
    }
    catch (error) {
        // Zod errors
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                error: "Invalid data",
                details: error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            });
            return;
        }
        // Prisma errors
        if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
            res.status(409).json({
                error: "A user with that email already exist",
                code: "DUPLICATE_EMAIL",
                message: "A user with that email already exists"
            });
            return;
        }
        console.log("Registration error:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
    finally {
        await prisma.$disconnect();
    }
});
// Logout endpoint
router.post('/logout', async (req, res) => {
    res.clearCookie('auth-token');
    res.json({ success: true });
});
// Me endpoint - get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.cookies['auth-token'];
        if (!token) {
            res.status(401).json({ error: "No token found" });
            return;
        }
        const payload = (0, auth_1.verifyToken)(token);
        if (!payload) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: {
                role: true,
                reviews: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        restaurant: {
                            select: {
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
                restaurants: {
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        address: true,
                        createdAt: true,
                        description: true,
                        phone: true,
                        website: true,
                        openHours: true,
                        reviews: {
                            select: {
                                id: true,
                                tasteScore: true,
                                serviceScore: true,
                                priceScore: true,
                                comment: true,
                                title: true,
                                createdAt: true,
                                restaurantId: true,
                                reported: true,
                                status: true,
                                author: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role.name,
                createdAt: user.createdAt.toISOString(),
                reviews: user.reviews.map((review) => ({
                    id: review.id,
                    restaurantId: review.restaurantId,
                    restaurantName: review.restaurant.name,
                    restaurantSlug: review.restaurant.slug,
                    comment: review.comment,
                    createdAt: review.createdAt.toISOString(),
                    tasteScore: review.tasteScore,
                    serviceScore: review.serviceScore,
                    priceScore: review.priceScore,
                    title: review.title,
                })),
                restaurants: user.restaurants.map((restaurant) => ({
                    id: restaurant.id,
                    name: restaurant.name,
                    slug: restaurant.slug,
                    description: restaurant.description,
                    address: restaurant.address,
                    phone: restaurant.phone,
                    website: restaurant.website,
                    openHours: restaurant.openHours,
                    createdAt: restaurant.createdAt.toISOString(),
                    reviews: restaurant.reviews.map((review) => ({
                        id: review.id,
                        restaurantId: review.restaurantId,
                        comment: review.comment,
                        createdAt: review.createdAt.toISOString(),
                        tasteScore: review.tasteScore,
                        serviceScore: review.serviceScore,
                        priceScore: review.priceScore,
                        title: review.title,
                        author: review.author,
                        reported: review.reported,
                        status: review.status,
                    })),
                })),
            },
        });
    }
    catch (error) {
        console.error("Auth check error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    finally {
        await prisma.$disconnect();
    }
});
exports.default = router;
