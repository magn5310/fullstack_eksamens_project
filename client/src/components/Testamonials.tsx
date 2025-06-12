"use client";

import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Define restaurant type to match API response
type Restaurant = {
  id: string;
  name: string;
  slug: string;
  address: string;
  averageRating: number;
  reviewCount: number;
  imageUrl: string | null;
};

function Testimonials() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("/api/restaurants/threebest");
        const data = await res.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching top restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Show loading state
  if (loading) {
    return <div className="w-full text-center py-8">Loading top restaurants...</div>;
  }

  // Show fallback if no restaurants found
  if (restaurants.length === 0) {
    return <div className="w-full text-center py-8">No top-rated restaurants found.</div>;
  }

  return (
    <div className="w-full">
      {/* Desktop: Grid layout */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-center">{restaurant.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {restaurant.imageUrl ? (
                <div className="relative h-48 w-full mb-4">
                  <Image 
                    src={restaurant.imageUrl} 
                    alt={restaurant.name} 
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-md"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center mb-4">
                  <p className="text-gray-500">No image</p>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Rating:</span>
                  <span>{restaurant.averageRating}  ({restaurant.reviewCount} {restaurant.reviewCount === 1 ? 'review' : 'reviews'})</span>
                </div>
                <p className="text-gray-600">{restaurant.address}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/products/${restaurant.slug}`} className="w-full">
                <Button className="w-full">See more</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Mobile: Carousel */}
      <div className="md:hidden max-w-sm mx-auto">
        <Carousel className="w-full">
          <CarouselContent>
            {restaurants.map((restaurant) => (
              <CarouselItem key={restaurant.id}>
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-center">{restaurant.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {restaurant.imageUrl ? (
                      <div className="relative h-48 w-full mb-4">
                        <Image 
                          src={restaurant.imageUrl} 
                          alt={restaurant.name} 
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center mb-4">
                        <p className="text-gray-500">No image</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Rating:</span>
                        <span>{restaurant.averageRating}  ({restaurant.reviewCount} {restaurant.reviewCount === 1 ? 'review' : 'reviews'})</span>
                      </div>
                      <p className="text-gray-600">{restaurant.address}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/products/${restaurant.slug}`} className="w-full">
                      <Button className="w-full">See more</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6">
            <CarouselPrevious className="static transform-none mx-2" />
            <CarouselNext className="static transform-none mx-2" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default Testimonials;
