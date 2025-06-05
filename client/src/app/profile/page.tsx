"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";


const mockReviews = [
  {
    id: "1",
    restaurant: "Kebab House",
    rating: 4,
    comment: "Great kebabs, with fresh ingredients and excellent service!",
    createdAt: "2024-01-15",
    tasteScore: 4,
    serviceScore: 5,
    priceScore: 3,
  },
  {
    id: "2",
    restaurant: "Shawarma King",
    rating: 3.5,
    comment: "Tasty shawarma, but the meat was a bit dry.",
    createdAt: "2024-01-10",
    tasteScore: 4,
    serviceScore: 3,
    priceScore: 4,
  },
];

const mockFavorites = [
  {
    id: "1",
    name: "torvets",
    slug: "torvets-kebab",
    rating: 4.2,
    address: "Nørrebrogade 123, København",
  },
  {
    id: "2",
    name: "Döner Palace",
    slug: "doner-palace",
    rating: 4.5,
    address: "Vesterbrogade 456, København",
  },
  {
    id: "3",
    name: "Istanbul Grill",
    slug: "istanbul-grill",
    rating: 4.0,
    address: "Strøget 789, København",
  },
];

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  const renderStar = (starNumber: number) => {
    if (rating >= starNumber) {
      return <FontAwesomeIcon key={starNumber} icon={faStar} className="text-black-400 w-4 h-4" />;
    } else if (rating >= starNumber - 0.5) {
      return <FontAwesomeIcon key={starNumber} icon={faStarHalfStroke} className="text-black-400 w-4 h-4"  />;
    } else {
      return <FontAwesomeIcon key={starNumber} icon={faStarRegular} className="text-black-400 w-4 h-4" />;
    }
  };

  return <div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map((starNumber) => renderStar(starNumber))}</div>;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"reviews" | "favorites">("reviews");
  console.log(user);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        <Card className="mb-8">
          <CardContent className="pt-8">
            <div className="flex flex-col items-center text-center space-y-4">

              <Avatar className="w-24 h-24">
                <AvatarImage  alt={`${user?.firstName} ${user?.lastName}`} />
                <AvatarFallback className="text-2xl bg-lilla text-[#fffffe]">
                  {user?.firstName[0]}
                  {user?.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <h1 className="text-3xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h1>

              <div className="flex gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-black">{user?.reviews.length}</div>
                  <div className="text-sm text-gray-600">Anmeldelser</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">{mockFavorites.length}</div>
                  <div className="text-sm text-gray-600">Favoritter</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            <button onClick={() => setActiveTab("reviews")} className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === "reviews" ? "bg-lilla text-white" : "text-gray-600 hover:text-gray-900"}`}>
              Mine anmeldelser
            </button>
            <button onClick={() => setActiveTab("favorites")} className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === "favorites" ? "bg-lilla text-white" : "text-gray-600 hover:text-gray-900"}`}>
              Favoritter
            </button>
          </div>
        </div>

        {activeTab === "reviews" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Mine anmeldelser</h2>

            {mockReviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-600 mb-4">Du har ikke skrevet nogen anmeldelser endnu.</p>
                  <Button asChild className="bg-lilla">
                    <Link href="/restaurants">Find restauranter</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <Card key={review.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{review.restaurant}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} />
                            <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString("da-DK")}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{review.comment}</p>

                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Smag: {review.tasteScore}/5</span>
                        <span>Service: {review.serviceScore}/5</span>
                        <span>Pris: {review.priceScore}/5</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Favoritter</h2>

            {mockFavorites.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-600 mb-4">Du har ikke tilføjet nogen favoritter endnu.</p>
                  <Button asChild className="bg-lilla">
                    <Link href="/restaurants">Find restauranter</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockFavorites.map((restaurant) => (
                  <Card key={restaurant.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <StarRating rating={restaurant.rating} />
                        <span className="text-sm text-gray-600">{restaurant.rating.toFixed(1)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">📍 {restaurant.address}</p>
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/products/${restaurant.slug}`}>Se restaurant</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}


        <div className="mt-12 text-center">
          <Button asChild className="bg-lilla hover:bg-lilla/90 px-8">
          <Link href="/profile/update">Opdater profil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
