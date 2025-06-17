"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../lib/auth");
const auth_2 = require("../lib/validations/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET /api/restaurants - Get all restaurants
router.get("/", async (req, res) => {
    try {
        const restaurants = await prisma.restaurant.findMany({
            include: {
                reviews: {
                    orderBy: { createdAt: "desc" },
                    take: 3, // Kun de seneste 3 reviews
                },
            },
        });
        res.json(restaurants);
    }
    catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ error: "Failed to fetch restaurants" });
    }
    finally {
        await prisma.$disconnect();
    }
});
// GET /api/restaurants/threebest - Get top 3 restaurants
router.get("/threebest", async (req, res) => {
    try {
        // Get all restaurants with their approved reviews
        const restaurants = await prisma.restaurant.findMany({
            include: {
                reviews: {
                    select: {
                        tasteScore: true,
                        serviceScore: true,
                        priceScore: true,
                    },
                },
            },
        });
        // Calculate average rating for each restaurant
        const ratedRestaurants = restaurants.map((restaurant) => {
            // Skip restaurants with no reviews (they'll get 0 rating)
            if (restaurant.reviews.length === 0) {
                return {
                    id: restaurant.id,
                    name: restaurant.name,
                    slug: restaurant.slug,
                    address: restaurant.address,
                    averageRating: 0,
                    reviewCount: 0,
                    imageUrl: restaurant.imageUrl || null,
                };
            }
            // Calculate average score across all reviews
            const totalScore = restaurant.reviews.reduce((acc, review) => {
                return acc + (review.tasteScore + review.serviceScore + review.priceScore) / 3;
            }, 0);
            const averageRating = totalScore / restaurant.reviews.length;
            return {
                id: restaurant.id,
                name: restaurant.name,
                slug: restaurant.slug,
                address: restaurant.address,
                averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
                reviewCount: restaurant.reviews.length,
                imageUrl: restaurant.imageUrl || null,
            };
        });
        // Sort by rating (highest first) and get top 3
        const topThree = ratedRestaurants
            .filter((r) => r.reviewCount > 0) // Only include restaurants with reviews
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, 3);
        res.json(topThree);
    }
    catch (error) {
        console.error("Error fetching top restaurants:", error);
        res.status(500).json({ error: "Failed to fetch top restaurants" });
    }
    finally {
        await prisma.$disconnect();
    }
});
// POST /api/restaurants - Create restaurant
router.post("/", async (req, res) => {
    try {
        const token = req.cookies["auth-token"];
        if (!token) {
            res.status(401).json({ error: "Must be logged in to create a restaurant" });
            return;
        }
        const decoded = (0, auth_1.verifyToken)(token);
        if (!decoded) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        const body = req.body;
        const validatedData = auth_2.createRestaurantSchema.parse(body);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { role: true, restaurants: true },
        });
        if (!user) {
            res.status(404).json({ error: "User does not exist" });
            return;
        }
        const existingRestaurant = await prisma.restaurant.findFirst({
            where: {
                name: {
                    equals: validatedData.name,
                },
            },
        });
        if (existingRestaurant) {
            res.status(409).json({ error: "A restaurant with this name already exists" });
            return;
        }
        const isFirstRestaurant = user.restaurants.length === 0;
        const fullAddress = `${validatedData.addressLine}, ${validatedData.postalCode} ${validatedData.city}`;
        const formatTime = (hour, minute) => {
            return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        };
        const openingTime = formatTime(validatedData.openingHour, validatedData.openingMinute);
        const closingTime = formatTime(validatedData.closingHour, validatedData.closingMinute);
        const openHours = `${openingTime}-${closingTime}`;
        const slug = await generateUniqueSlug(validatedData.name);
        let restaurantOwnerRole = null;
        if (isFirstRestaurant && user.role.name !== "restaurant owner") {
            restaurantOwnerRole = await prisma.role.findUnique({
                where: { name: "restaurant owner" },
            });
            if (!restaurantOwnerRole) {
                res.status(500).json({ error: "Restaurant owner role not found in system" });
                return;
            }
        }
        const result = await prisma.$transaction(async (tx) => {
            const restaurant = await tx.restaurant.create({
                data: {
                    name: validatedData.name,
                    address: fullAddress,
                    slug: slug,
                    description: validatedData.description,
                    openHours: openHours,
                    phone: validatedData.phone,
                    website: validatedData.website ?? "",
                    imageUrl: validatedData.image,
                    ownerId: user.id,
                },
                include: {
                    owner: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            });
            if (isFirstRestaurant && restaurantOwnerRole && user.role.name !== "restaurant owner") {
                await tx.user.update({
                    where: { id: user.id },
                    data: { roleId: restaurantOwnerRole.id },
                });
                restaurant.owner.role = {
                    id: restaurantOwnerRole.id,
                    name: restaurantOwnerRole.name,
                };
            }
            return restaurant;
        });
        res.status(201).json({
            message: "Restaurant created",
            restaurant: result,
            roleUpdated: isFirstRestaurant && user.role.name !== "restaurant owner",
            redirect: `/restaurant/${slug}`,
        });
    }
    catch (error) {
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
        if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
            res.status(409).json({ error: "Restaurant with that name already exist" });
            return;
        }
        console.error("Create restaurant error:", error);
        res.status(500).json({ error: "An error happened creating your restaurant" });
    }
    finally {
        await prisma.$disconnect();
    }
});
// Helper function to generate unique slug
async function generateUniqueSlug(baseName) {
    const slug = generateSlug(baseName);
    let counter = 0;
    while (true) {
        const testSlug = counter === 0 ? slug : `${slug}-${counter}`;
        const existing = await prisma.restaurant.findUnique({
            where: { slug: testSlug },
        });
        if (!existing) {
            return testSlug;
        }
        counter++;
    }
}
function generateSlug(name) {
    return name
        .toLowerCase()
        .replace(/æ/g, "ae")
        .replace(/ø/g, "oe")
        .replace(/å/g, "aa")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}
// PUT /api/restaurant/:id - Update restaurant
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
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
        const body = req.body;
        // Basic validation schema for update
        const updateSchema = zod_1.z.object({
            name: zod_1.z.string().min(1, "Restaurant name is required"),
            description: zod_1.z.string().min(1, "Description is required"),
            address: zod_1.z.string().min(1, "Address is required"),
            phone: zod_1.z.string().min(1, "Phone number is required"),
            website: zod_1.z.string().url("Invalid website URL").optional().or(zod_1.z.literal("")),
            openHours: zod_1.z.string().min(1, "Open hours are required"),
        });
        const validatedData = updateSchema.parse(body);
        // Check if restaurant exists
        const existingRestaurant = await prisma.restaurant.findUnique({
            where: { id },
        });
        if (!existingRestaurant) {
            res.status(404).json({ error: "Restaurant not found" });
            return;
        }
        // Update restaurant
        const updatedRestaurant = await prisma.restaurant.update({
            where: { id },
            data: {
                name: validatedData.name,
                description: validatedData.description,
                address: validatedData.address,
                phone: validatedData.phone,
                website: validatedData.website,
                openHours: validatedData.openHours,
            },
        });
        res.json({
            success: true,
            message: "Restaurant updated successfully",
            restaurant: updatedRestaurant,
        });
    }
    catch (error) {
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
        console.error("Update restaurant error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    finally {
        await prisma.$disconnect();
    }
});
// GET /api/restaurant/:slug - Get restaurant by slug (for restaurant detail page)
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const restaurant = await prisma.restaurant.findUnique({
            where: { slug },
            include: {
                reviews: {
                    where: { status: { not: "APPROVED" } }, // Show non-approved reviews
                    orderBy: { createdAt: "desc" },
                    include: {
                        author: true,
                    },
                },
            },
        });
        if (!restaurant) {
            res.status(404).json({ error: "Restaurant not found" });
            return;
        }
        res.json(restaurant);
    }
    catch (error) {
        console.error("Error fetching restaurant:", error);
        res.status(500).json({ error: "Failed to fetch restaurant" });
    }
    finally {
        await prisma.$disconnect();
    }
});
// PUT /api/restaurant/report/:id - Report/unreport review
router.put('/report/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.cookies['auth-token'];
        if (!token) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        const payload = (0, auth_1.verifyToken)(token);
        if (!payload) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        // Get the review
        const review = await prisma.review.findUnique({
            where: { id: id },
        });
        if (!review) {
            res.status(404).json({ error: "Review not found" });
            return;
        }
        // Check if user owns the restaurant
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: review.restaurantId, ownerId: payload.userId },
        });
        if (!restaurant) {
            res.status(403).json({ error: "You can only report reviews for your own restaurants" });
            return;
        }
        let updatedReview;
        if (!review.reported) {
            updatedReview = await prisma.review.update({
                where: { id: id },
                data: { reported: true, status: "PENDING" },
            });
            res.json({
                success: true,
                message: "Review reported successfully",
                review: updatedReview,
            });
        }
        else {
            updatedReview = await prisma.review.update({
                where: { id: id },
                data: { reported: false },
            });
            res.json({
                success: true,
                message: "Review unreported successfully",
                review: updatedReview,
            });
        }
    }
    catch (error) {
        console.error("Error reporting review:", error);
        res.status(500).json({ error: "Failed to report review" });
    }
    finally {
        await prisma.$disconnect();
    }
});
exports.default = router;
