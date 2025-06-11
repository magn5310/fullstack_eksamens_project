import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
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
    const ratedRestaurants = restaurants.map(restaurant => {
      // Skip restaurants with no reviews (they'll get 0 rating)
      if (restaurant.reviews.length === 0) {
        return { 
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug,
          address: restaurant.address,
          averageRating: 0,
          reviewCount: 0,
          imageUrl: restaurant.imageUrl || null
        };
      }
      
      // Calculate average score across all reviews
      const totalScore = restaurant.reviews.reduce(
        (acc, review) => {
          return acc + ((review.tasteScore + review.serviceScore + review.priceScore) / 3);
        }, 
        0
      );
      
      const averageRating = totalScore / restaurant.reviews.length;
      
      return {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        address: restaurant.address,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: restaurant.reviews.length,
        imageUrl: restaurant.imageUrl || null
      };
    });

    // Sort by rating (highest first) and get top 3
    const topThree = ratedRestaurants
      .filter(r => r.reviewCount > 0) // Only include restaurants with reviews
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 3);
      
    return NextResponse.json(topThree);
  } catch (error) {
    console.error("Error fetching top restaurants:", error);
    return NextResponse.json({ error: "Failed to fetch top restaurants" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}