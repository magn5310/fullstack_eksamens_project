import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyPassword, generateToken, verifyToken } from "../lib/auth";
import { registerSchema, loginSchema } from "../lib/validations/auth";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

// Login endpoint - med korrekte Express typer
router.post("/login", async (req: Request, res: Response): Promise<void> => {
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

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = await generateToken(user.id);

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
        reviews: user.reviews.map((review: any) => ({
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
        restaurants: user.restaurants.map((restaurant: any) => ({
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug,
          description: restaurant.description,
          address: restaurant.address,
          phone: restaurant.phone,
          website: restaurant.website,
          openHours: restaurant.openHours,
          createdAt: restaurant.createdAt.toISOString(),
          reviews: restaurant.reviews.map((review: any) => ({
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
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ error: "Error when tried to login" });
  } finally {
    await prisma.$disconnect();
  }
});

// Register endpoint
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;
  
      // Zod validation
      const validatedData = registerSchema.parse(body);
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
      const { hashPassword } = await import('../lib/auth');
      const hashedPassword = await hashPassword(password);
  
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
      const token = generateToken(user.id);
  
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
    } catch (error: any) {
      // Zod errors
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: "Invalid data",
          details: error.errors.map((err: any) => ({
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
    } finally {
      await prisma.$disconnect();
    }
  });
  
  // Logout endpoint
  router.post('/logout', async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('auth-token');
    res.json({ success: true });
  });
  
  // Me endpoint - get current user
  router.get('/me', async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.cookies['auth-token'];
  
      if (!token) {
        res.status(401).json({ error: "No token found" });
        return;
      }
  
      const payload = verifyToken(token);
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
          reviews: user.reviews.map((review: any) => ({
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
          restaurants: user.restaurants.map((restaurant: any) => ({
            id: restaurant.id,
            name: restaurant.name,
            slug: restaurant.slug,
            description: restaurant.description,
            address: restaurant.address,
            phone: restaurant.phone,
            website: restaurant.website,
            openHours: restaurant.openHours,
            createdAt: restaurant.createdAt.toISOString(),
            reviews: restaurant.reviews.map((review: any) => ({
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
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  });
export default router;
