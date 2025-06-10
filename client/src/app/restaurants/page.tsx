"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";

interface Review {
  id: number;
  authorName: string;
  comment?: string;
  createdAt: string;
  tasteScore: number;
  serviceScore: number;
  priceScore: number;
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
  createdAt?: string;
  imageUrl: string;
}

interface Filters {
  searchTerm: string;
  sortBy: "name" | "rating-high" | "rating-low" | "reviews-most" | "reviews-least" | "newest" | "oldest";
  minRating: number;
  maxRating: number;
  minReviews: number;
}

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  const renderStar = (starNumber: number) => {
    const threshold = starNumber - 0.5;
    const nextThreshold = starNumber;

    if (rating < threshold) {
      return <FontAwesomeIcon key={starNumber} icon={faStarRegular} className="text-black w-4 h-4" />;
    } else if (rating >= threshold && rating < nextThreshold) {
      return <FontAwesomeIcon key={starNumber} icon={faStarHalfAlt} className="text-black w-4 h-4" />;
    } else {
      return <FontAwesomeIcon key={starNumber} icon={faStar} className="text-black w-4 h-4" />;
    }
  };

  return <div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map((starNumber) => renderStar(starNumber))}</div>;
}

// Filter Sidebar Component
function FilterSidebar({ filters, setFilters, onClearFilters }: { filters: Filters; setFilters: (filters: Filters) => void; onClearFilters: () => void }) {
  return (
    <div className="w-80 bg-card border-r border-border p-6 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear All
        </Button>
      </div>

      <div className="space-y-2 mb-6">
        <Label htmlFor="search">Search Restaurants</Label>
        <Input id="search" placeholder="Search by name..." value={filters.searchTerm} onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })} />
      </div>

      <div className="space-y-2 mb-6">
        <Label>Sort By</Label>
        <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value as Filters["sortBy"] })}>
          <SelectTrigger>
            <SelectValue placeholder="Select sorting..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="rating-high">Highest Rating</SelectItem>
            <SelectItem value="rating-low">Lowest Rating</SelectItem>
            <SelectItem value="reviews-most">Most Reviews</SelectItem>
            <SelectItem value="reviews-least">Fewest Reviews</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 mb-6">
        <Label>Rating Range</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="minRating" className="text-xs">
              Min
            </Label>
            <Input id="minRating" type="number" min="0" max="5" step="0.1" value={filters.minRating} onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="flex-1">
            <Label htmlFor="maxRating" className="text-xs">
              Max
            </Label>
            <Input id="maxRating" type="number" min="0" max="5" step="0.1" value={filters.maxRating} onChange={(e) => setFilters({ ...filters, maxRating: parseFloat(e.target.value) || 5 })} />
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <Label htmlFor="minReviews">Minimum Reviews</Label>
        <Input id="minReviews" type="number" min="0" value={filters.minReviews} onChange={(e) => setFilters({ ...filters, minReviews: parseInt(e.target.value) || 0 })} />
      </div>
    </div>
  );
}

// Main List Component
function RestaurantsList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [filters, setFilters] = useState<Filters>({
    searchTerm: searchQuery,
    sortBy: "rating-high",
    minRating: 0,
    maxRating: 5,
    minReviews: 0,
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch("/api/restaurants");
      const data = await res.json();
      setRestaurants(data);
    };

    fetchRestaurants();
  }, []);

  // Apply filters whenever restaurants or filters change
  useEffect(() => {
    let filtered = [...restaurants];

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter((restaurant) => restaurant.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || restaurant.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) || restaurant.address?.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    }

    // Rating range filter
    filtered = filtered.filter((restaurant) => {
      const rating = calculateAverageRating(restaurant.reviews);
      return rating >= filters.minRating && rating <= filters.maxRating;
    });

    // Minimum reviews filter
    filtered = filtered.filter((restaurant) => restaurant.reviews.length >= filters.minReviews);

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating-high":
          return calculateAverageRating(b.reviews) - calculateAverageRating(a.reviews);
        case "rating-low":
          return calculateAverageRating(a.reviews) - calculateAverageRating(b.reviews);
        case "reviews-most":
          return b.reviews.length - a.reviews.length;
        case "reviews-least":
          return a.reviews.length - b.reviews.length;
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "oldest":
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredRestaurants(filtered);
  }, [restaurants, filters]);

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      sortBy: "rating-high",
      minRating: 0,
      maxRating: 5,
      minReviews: 0,
    });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <FilterSidebar filters={filters} setFilters={setFilters} onClearFilters={clearFilters} />

      {/* Main Content */}
      <div className="flex-1 px-10 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Restaurants</h1>
          <p className="text-muted-foreground">
            Showing {filteredRestaurants.length} of {restaurants.length} restaurants
          </p>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No restaurants found matching your filters.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map((restaurant) => {
              const averageRating = calculateAverageRating(restaurant.reviews);

              return (
                <Card key={restaurant.id} className="rounded-md max-w-120 justify-between pt-0 shadow hover:shadow-lg transition-shadow">
                  <CardHeader className="relative h-48">
                    <Image className="align-center mx-auto rounded-t-md mb-2" src={restaurant.imageUrl} alt={restaurant.name} fill={true} style={{ objectFit: "cover" }} />
                  </CardHeader>

                  <CardContent className="flex flex-col gap-3">
                    <CardTitle className="font-bold">{restaurant.name}</CardTitle>

                    {/* Star Rating Display */}
                    <div className="flex items-center gap-2 my-2">
                      <StarRating rating={averageRating} />
                      <span className="text-sm font-normal text-gray-500">{averageRating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({restaurant.reviews.length} reviews)</span>
                    </div>

                    <p className="text-sm text-muted-foreground">{restaurant.description}</p>
                    {restaurant.address && 
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FontAwesomeIcon icon={faLocationDot} style={{ color: "#000000" }} />
                        <span className="text-xs text-muted-foreground">{restaurant.address}</span>
                      </div>
                    }
                  </CardContent>

                  <CardFooter>
                    <Button asChild className="bg-lilla">
                      <Link href={`/products/${restaurant.slug}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Loading component
function RestaurantsLoading() {
  return (
    <div className="flex">
      <div className="w-80 bg-card border-r border-border p-6 h-screen">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <div className="flex-1 px-10 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8 w-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function RestaurantsPage() {
  return (
    <Suspense fallback={<RestaurantsLoading />}>
      <RestaurantsList />
    </Suspense>
  );
}

function calculateAverageRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.tasteScore + review.serviceScore + review.priceScore, 0);
  return sum / (reviews.length * 3);
}
