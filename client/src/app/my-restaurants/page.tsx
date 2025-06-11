"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke, faEdit, faPlus, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Brug types fra AuthContext i stedet for at definere dem igen
type Restaurant = NonNullable<NonNullable<ReturnType<typeof useAuth>["user"]>["restaurants"]>[0];
type Review = Restaurant["reviews"][0];

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  const renderStar = (starNumber: number) => {
    if (rating >= starNumber) {
      return <FontAwesomeIcon key={starNumber} icon={faStar} className="text-black-500 w-4 h-4" />;
    } else if (rating >= starNumber - 0.5) {
      return <FontAwesomeIcon key={starNumber} icon={faStarHalfStroke} className="text-black-500 w-4 h-4" />;
    } else {
      return <FontAwesomeIcon key={starNumber} icon={faStarRegular} className="text-black-500 w-4 h-4" />;
    }
  };

  return <div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map((starNumber) => renderStar(starNumber))}</div>;
}

// Restaurant Statistics Component
function RestaurantStats({ restaurant }: { restaurant: Restaurant }) {
  const averageRating = restaurant.reviews.length > 0 ? restaurant.reviews.reduce((sum, review) => sum + (review.tasteScore + review.serviceScore + review.priceScore) / 3, 0) / restaurant.reviews.length : 0;

  const recentReviews = restaurant.reviews.filter((review) => new Date(review.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{restaurant.reviews.length}</div>
          <div className="text-sm text-gray-600">Total Reviews</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <StarRating rating={averageRating} />
            <span className="ml-2 text-xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
          </div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{recentReviews}</div>
          <div className="text-sm text-gray-600">Reviews (30 days)</div>
        </CardContent>
      </Card>
    </div>
  );
}

// Recent Reviews Component
function RecentReviews({ reviews }: { reviews: Review[] }) {
  // Add state to track reviews locally
  const [reviewsList, setReviewsList] = useState<Review[]>(reviews);

  // Sort on the state list
  const recentReviews = reviewsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const handleReport = async (reviewId: string) => {
    const review = reviewsList.find((r) => r.id === reviewId);
    if (!review) return;

    try {
      const res = await fetch(`/api/restaurant/report/${reviewId}`, {
        method: "PUT",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update review");

      const data = await res.json();

      // Update local state optimistically
      setReviewsList((prev) => prev.map((r) => (r.id === reviewId ? { ...r, reported: !r.reported } : r)));

      // Show success message
      toast.success(data.message);
    } catch (err) {
      console.error("Error updating review:", err);
      toast.error("Failed to update review status");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
          Recent Reviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentReviews.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {recentReviews.map((review) => {
              const averageRating = Math.round(((review.tasteScore + review.serviceScore + review.priceScore) / 3) * 10) / 10;
              return (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.author?.firstName} {review.author?.lastName}
                      </p>
                      <div className="flex items-center gap-2">
                        <StarRating rating={averageRating} />
                        <p className="text-gray-500">{averageRating}</p>
                        <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString("da-DK")}</span>
                      </div>
                    </div>
                    {!review.reported ? (
                      <Button size="sm" onClick={() => handleReport(review.id)} className="cursor-pointer bg-red-500 hover:bg-red-600 text-white">
                        Report
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleReport(review.id)} className="cursor-pointer bg-red-500 hover:bg-red-600 text-white">
                        Unreport
                      </Button>
                    )}
                  </div>
                  {review.comment && <p className="text-gray-700 text-sm">{review.comment}</p>}
                  <div className="flex gap-4 text-xs text-gray-500 mt-2">
                    <span>Taste: {review.tasteScore}/5</span>
                    <span>Service: {review.serviceScore}/5</span>
                    <span>Price: {review.priceScore}/5</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MyRestaurantsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Redirect hvis ikke logget ind
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Redirect hvis ingen restauranter (kun efter loading er færdig)
  useEffect(() => {
    if (!isLoading && user && (!user.restaurants || user.restaurants.length === 0)) {
      router.push("/restaurants");
    }
  }, [user, isLoading, router]);

  // Auto-select first restaurant when user data loads
  useEffect(() => {
    if (user?.restaurants && user.restaurants.length > 0 && !selectedRestaurant) {
      setSelectedRestaurant(user.restaurants[0]);
    }
  }, [user, selectedRestaurant]);

  const restaurants = user?.restaurants || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lilla mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your restaurants...</p>
        </div>
      </div>
    );
  }

  // Not logged in (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lilla mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // No restaurants (will redirect)
  if (!user.restaurants || user.restaurants.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lilla mx-auto mb-4"></div>
          <p className="text-gray-600">No restaurants found. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <Card className="mb-8">
          <CardContent className="pt-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage alt={`${user?.firstName} ${user?.lastName}`} />
                <AvatarFallback className="text-2xl bg-lilla text-[#fffffe]">
                  {user?.firstName[0]}
                  {user?.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <h1 className="text-3xl font-bold text-gray-900">My Restaurants</h1>
              <p className="text-gray-600">
                Welcome back, {user?.firstName} {user?.lastName}
              </p>

              <div className="flex gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-black">{restaurants.length}</div>
                  <div className="text-sm text-gray-600">Restaurants</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{restaurants.reduce((total, restaurant) => total + restaurant.reviews.length, 0)}</div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* No Restaurants State */}
        {restaurants.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FontAwesomeIcon icon={faPlus} className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants yet</h3>
              <p className="text-gray-600 mb-6">You have not added any restaurants yet. Get started by adding your first restaurant.</p>
              <Button className="bg-lilla hover:bg-lilla/90">
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
                Add Restaurant
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {restaurants.length > 1 && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Select Restaurant:</label>
                    <Select
                      value={selectedRestaurant?.id || ""}
                      onValueChange={(value) => {
                        const restaurant = restaurants.find((r) => r.id === value);
                        setSelectedRestaurant(restaurant || null);
                      }}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Choose a restaurant" />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurants.map((restaurant) => (
                          <SelectItem key={restaurant.id} value={restaurant.id}>
                            <div className="flex items-center justify-between">
                              <span>{restaurant.name}</span>
                              <span className="text-sm text-gray-500 ml-2">({restaurant.reviews.length} reviews)</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedRestaurant && (
              <>
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedRestaurant.name}</h2>
                        <p className="text-gray-600 mb-2">{selectedRestaurant.description}</p>
                        {selectedRestaurant.address && <p className="text-sm text-gray-500">📍 {selectedRestaurant.address}</p>}
                        {selectedRestaurant.phone && <p className="text-sm text-gray-500">📞 {selectedRestaurant.phone}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" asChild>
                          <Link href={`/products/${selectedRestaurant.slug}`}>View Public Page</Link>
                        </Button>
                        <Button className="bg-lilla hover:bg-lilla/90" asChild>
                          <Link href={`my-restaurants/edit/${selectedRestaurant.id}`} className="flex items-center">
                            <FontAwesomeIcon icon={faEdit} className="w-4 h-4 mr-2" />
                            Edit Restaurant
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Restaurant Statistics */}
                <RestaurantStats restaurant={selectedRestaurant} />

                {/* Recent Reviews */}
                <RecentReviews reviews={selectedRestaurant.reviews} />
              </>
            )}

            {/* Action Buttons */}
            <div className="mt-12 flex justify-center gap-4">
              <Button variant="outline" className="px-8">
                <Link href={"restaurants/create"}>
                  <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
                  Add New Restaurant
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
