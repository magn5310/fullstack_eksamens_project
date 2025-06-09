"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EditRestaurantForm from "@/components/EditRestaurantForm";

type Restaurant = NonNullable<NonNullable<ReturnType<typeof useAuth>["user"]>["restaurants"]>[0];


interface EditRestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default function EditRestaurantPage({ params }: EditRestaurantPageProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  // Get restaurant ID from params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setRestaurantId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  // Find restaurant data from user context
  useEffect(() => {
    if (restaurantId && user?.restaurants) {
      const foundRestaurant = user.restaurants.find((r) => r.id === restaurantId);
      setRestaurant(foundRestaurant || null);
    }
  }, [restaurantId, user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Redirect if no restaurants
  useEffect(() => {
    if (!isLoading && user && (!user.restaurants || user.restaurants.length === 0)) {
      router.push("/my-restaurants");
    }
  }, [user, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lilla mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant data...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lilla mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // No restaurants
  if (!user.restaurants || user.restaurants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Du har ingen restauranter at redigere.</p>
          <Button asChild className="bg-lilla">
            <Link href="/my-restaurants">Gå til My Restaurants</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Restaurant not found
  if (restaurantId && !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Restaurant ikke fundet.</p>
          <Button asChild className="bg-lilla">
            <Link href="/my-restaurants">Gå til My Restaurants</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show form when restaurant is found
  if (restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <EditRestaurantForm restaurant={restaurant} />
        </div>
      </div>
    );
  }

  // Loading restaurant data
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lilla mx-auto mb-4"></div>
        <p className="text-gray-600">Loading restaurant...</p>
      </div>
    </div>
  );
}
