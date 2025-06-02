"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

interface Review {
  id: number;
  authorName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address?: string;
  phone?: string;
  website?: string;
  slug: string;
  reviews: Review[];
}

export default function List() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch("/api/restaurants");
      const data = await res.json();
      setRestaurants(data);
    };

    fetchRestaurants();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Restaurants</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="rounded-2xl shadow hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-center">{restaurant.name}</CardTitle>
              <Image className="align-center mx-auto rounded-lg mb-2" 
                src={`/images/kebab.jpg`} // Assuming images are named by slug
                alt={restaurant.name}
                width={250}
                height={250}
                ></Image>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">{restaurant.description}</p>
              {restaurant.address && (
                <p className="text-xs mt-2 text-foreground">
                  📍 {restaurant.address}
                </p>
              )}
            </CardContent>

            <CardContent className="flex justify-center gap-2 items-center mt-2">
              <FontAwesomeIcon icon={faStar} className="text-yellow-400 w-4 h-4" />
              
              <p className="text-sm font-semibold">
                {calculateAverageRating(restaurant.reviews).toFixed(1)} / 5
              </p>
            </CardContent>

            <CardFooter>
              <Link href={`/products/${restaurant.slug}`} className="w-full">
                <Button className="w-full">View</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function calculateAverageRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}
