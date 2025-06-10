"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Restaurant, Review } from "@prisma/client";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ReviewWithAuthor = Review & {
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingReviews: number;
  pendingReviewsData: ReviewWithAuthor[];
  approvedReviews: number;
  approvedReviewsData: ReviewWithAuthor[];
  rejectedReviews: number;
  rejectedReviewsData: ReviewWithAuthor[];
  totalRestaurants: number;
  totalRestaurantsData: Restaurant[];
  totalReviews: number;
}

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

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "restaurants" | "reviews">("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleReviewAction = async (reviewId: string, action: "APPROVED" | "REJECTED" | "PENDING") => {
    try {
      const res = await fetch(`/api/admin/review/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update review status");
      const { review } = await res.json();

      setStats((prev) => {
        if (!prev) return prev;

        // Find which list the review is currently in
        const isInPending = prev.pendingReviewsData.some((r) => r.id === reviewId);
        const isInApproved = prev.approvedReviewsData.some((r) => r.id === reviewId);
        const isInRejected = prev.rejectedReviewsData.some((r) => r.id === reviewId);

        // Create new state
        const newState = { ...prev };

        // Remove from current list
        if (isInPending) {
          newState.pendingReviewsData = prev.pendingReviewsData.filter((r) => r.id !== reviewId);
          newState.pendingReviews = Math.max(prev.pendingReviews - 1, 0);
        }
        if (isInApproved) {
          newState.approvedReviewsData = prev.approvedReviewsData.filter((r) => r.id !== reviewId);
          newState.approvedReviews = Math.max(prev.approvedReviews - 1, 0);
        }
        if (isInRejected) {
          newState.rejectedReviewsData = prev.rejectedReviewsData.filter((r) => r.id !== reviewId);
          newState.rejectedReviews = Math.max(prev.rejectedReviews - 1, 0);
        }

        // Add to new list
        if (action === "PENDING") {
          newState.pendingReviewsData = [review, ...newState.pendingReviewsData];
          newState.pendingReviews = newState.pendingReviews + 1;
        } else if (action === "APPROVED") {
          newState.approvedReviewsData = [review, ...newState.approvedReviewsData];
          newState.approvedReviews = newState.approvedReviews + 1;
        } else if (action === "REJECTED") {
          newState.rejectedReviewsData = [review, ...newState.rejectedReviewsData];
          newState.rejectedReviews = newState.rejectedReviews + 1;
        }

        return newState;
      });
    } catch (err) {
      console.error("Error updating review:", err);
      alert("Failed to update review status");
    }
  };

  const handleRemoveRestaurant = async (restaurantId: string) => {
    if (confirm("Are you sure you want to remove this restaurant? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/admin/restaurant/${restaurantId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to remove restaurant");

        // Update UI by filtering out the deleted restaurant
        setStats((prev) =>
          prev
            ? {
                ...prev,
                totalRestaurantsData: prev.totalRestaurantsData.filter((r) => r.id !== restaurantId),
                totalRestaurants: prev.totalRestaurants - 1,
              }
            : prev
        );
      } catch (err) {
        console.error("Error removing restaurant:", err);
        alert("Failed to remove restaurant");
      }
    }
  };
  console.log(stats);

  // Redirect hvis ikke admin
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "Admin")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Hent statistikker
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/stats", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "Admin") {
      fetchStats();
    }
  }, [user]);

  // Loading state
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lilla mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Not admin
  if (!user || user.role !== "Admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Du har ikke tilladelse til at se denne side.</p>
          <Button onClick={() => router.push("/")}>Gå til forsiden</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Kebabadvisor</h1>
          <p className="text-sm text-gray-600">Admin Panel</p>
        </div>

        <nav className="space-y-4">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "dashboard" ? "bg-lilla text-white" : "text-gray-700 hover:bg-gray-100"}`}>
            Dashboard
          </button>

          <button onClick={() => setActiveTab("restaurants")} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "restaurants" ? "bg-lilla text-white" : "text-gray-700 hover:bg-gray-100"}`}>
            Restaurants
          </button>

          <button onClick={() => setActiveTab("reviews")} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "reviews" ? "bg-lilla text-white" : "text-gray-700 hover:bg-gray-100"}`}>
            Reviews
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Velkommen tilbage, {user.firstName}!</p>
        </div>

        {activeTab === "dashboard" && stats && (
          <div className="space-y-8">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Activity Card */}
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">User Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">{stats.totalUsers.toLocaleString()}</div>
                    <div className="text-gray-600">Total Users</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-green-600 mb-1">{stats.activeUsers.toLocaleString()}</div>
                    <div className="text-gray-600">Active Users (30 days)</div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Card */}
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">Reported Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 flex justify-between">
                  <div>
                    <div className="text-4xl font-bold text-orange-600 mb-1">{stats.pendingReviews}</div>
                    <div className="text-gray-600">Pending</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-green-600 mb-1">{stats.approvedReviews.toLocaleString()}</div>
                    <div className="text-gray-600">Approved</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-red-600 mb-1">{stats.rejectedReviews.toLocaleString()}</div>
                    <div className="text-gray-600">Rejected</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistics Card */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">{stats.totalRestaurants}</div>
                    <div className="text-gray-600">Restaurants</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">{stats.totalReviews.toLocaleString()}</div>
                    <div className="text-gray-600">Total Reviews</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-red-600 mb-1">{stats.rejectedReviews}</div>
                    <div className="text-gray-600">Rejected Reviews</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Summary */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <CardContent>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600 font-medium">User Engagement:</span>
                    <div className="text-blue-900">{stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% active</div>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Avg Reviews/Restaurant:</span>
                    <div className="text-blue-900">{stats.totalRestaurants > 0 ? Math.round(stats.totalReviews / stats.totalRestaurants) : 0}</div>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Review Approval Rate:</span>
                    <div className="text-blue-900">{stats.totalReviews > 0 ? Math.round((stats.approvedReviews / stats.totalReviews) * 100) : 0}%</div>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Pending Actions:</span>
                    <div className="text-blue-900">{stats.pendingReviews} reviews</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "restaurants" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Restaurant Management</h2>
            </div>

            <Card>
              <CardContent className="p-6">
                {stats?.totalRestaurantsData.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No restaurants found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats?.totalRestaurantsData.map((restaurant) => (
                      <Card key={restaurant.id} className="p-4">
                        <CardHeader className="pb-2 flex justify-between items-start">
                          <CardTitle className="text-lg font-semibold text-gray-900">{restaurant.name}</CardTitle>
                          <Button  size="sm" onClick={() => handleRemoveRestaurant(restaurant.id)}>
                            Remove
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-gray-700 text-sm">{restaurant.address}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "reviews" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</div>
                <div className="text-sm text-gray-600">Pending Approval</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.approvedReviews.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-red-600">{stats.rejectedReviews}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                {stats.pendingReviews === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No pending reviews</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.pendingReviewsData.map((review) => {
                      const averageRating = (review.tasteScore + review.serviceScore + review.priceScore) / 3;
                      return (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{review.title}</h3>
                              <p className="text-sm font-medium text-gray-700">
                                {review.author.firstName} {review.author.lastName}
                              </p>
                              <StarRating rating={averageRating} />
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString("da-DK")}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleReviewAction(review.id, "APPROVED")}>
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => handleReviewAction(review.id, "REJECTED")}>
                                Reject
                              </Button>
                            </div>
                          </div>

                          {review.comment && <p className="text-gray-700 text-sm mb-3">{review.comment}</p>}

                          <div className="flex gap-4 text-xs text-gray-500">
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
            <Card>
              <CardContent className="p-6">
                {stats.approvedReviews === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No Approved reviews</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.approvedReviewsData.map((review) => {
                      const averageRating = (review.tasteScore + review.serviceScore + review.priceScore) / 3;
                      return (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{review.title}</h3>
                              <p className="text-sm font-medium text-gray-700">
                                {review.author.firstName} {review.author.lastName}
                              </p>
                              <StarRating rating={averageRating} />
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString("da-DK")}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button size="sm" className=" text-white" onClick={() => handleReviewAction(review.id, "PENDING")}>
                                Remove
                              </Button>
                            </div>
                          </div>

                          {review.comment && <p className="text-gray-700 text-sm mb-3">{review.comment}</p>}

                          <div className="flex gap-4 text-xs text-gray-500">
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
            <Card>
              <CardContent className="p-6">
                {stats.rejectedReviews === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No Rejected reviews</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.rejectedReviewsData.map((review) => {
                      const averageRating = (review.tasteScore + review.serviceScore + review.priceScore) / 3;
                      return (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{review.title}</h3>
                              <p className="text-sm font-medium text-gray-700">
                                {review.author.firstName} {review.author.lastName}
                              </p>
                              <StarRating rating={averageRating} />
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString("da-DK")}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button size="sm" className="text-white" onClick={() => handleReviewAction(review.id, "PENDING")}>
                                Remove
                              </Button>
                            </div>
                          </div>

                          {review.comment && <p className="text-gray-700 text-sm mb-3">{review.comment}</p>}

                          <div className="flex gap-4 text-xs text-gray-500">
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
          </div>
        )}
      </div>
    </div>
  );
}
