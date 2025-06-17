"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = PUT;
const server_1 = require("next/server");
const auth_1 = require("@/lib/auth");
const prisma_1 = require("@/lib/prisma");
const zod_1 = require("zod");
const updateRestaurantSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Restaurant name is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    address: zod_1.z.string().min(1, "Address is required"),
    phone: zod_1.z.string().min(1, "Phone number is required"),
    website: zod_1.z.string().url("Invalid website URL").optional().or(zod_1.z.literal("")),
    openHours: zod_1.z.string().min(1, "Open hours are required"),
});
// PUT - Opdater restaurant data
async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const token = request.cookies.get("auth-token")?.value;
        if (!token) {
            return server_1.NextResponse.json({ error: "No token found" }, { status: 401 });
        }
        const payload = (0, auth_1.verifyToken)(token);
        if (!payload) {
            return server_1.NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        const body = await request.json();
        const validatedData = updateRestaurantSchema.parse(body);
        // Verificer at restauranten eksisterer
        const existingRestaurant = await prisma_1.prisma.restaurant.findUnique({
            where: { id },
        });
        if (!existingRestaurant) {
            return server_1.NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
        }
        // Opdater restauranten
        const updatedRestaurant = await prisma_1.prisma.restaurant.update({
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
        return server_1.NextResponse.json({
            success: true,
            message: "Restaurant updated successfully",
            restaurant: updatedRestaurant,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return server_1.NextResponse.json({
                error: "Invalid data",
                details: error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            }, { status: 400 });
        }
        console.error("Update restaurant error:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
}
//# sourceMappingURL=route.js.map