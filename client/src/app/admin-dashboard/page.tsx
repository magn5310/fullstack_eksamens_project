"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  totalRestaurants: number;
  totalReviews: number;
}

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "restaurants" | "reviews">("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-4xl font-bold text-orange-600 mb-1">{stats.pendingReviews}</div>
                    <div className="text-gray-600">Pending</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-green-600 mb-1">{stats.approvedReviews.toLocaleString()}</div>
                    <div className="text-gray-600">Approved</div>
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

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button className="bg-lilla hover:bg-lilla/90 text-white px-8 py-3 text-lg" onClick={() => setActiveTab("restaurants")}>
                Update Restaurant Profiles
              </Button>
              <Button className="bg-lilla hover:bg-lilla/90 text-white px-8 py-3 text-lg" onClick={() => setActiveTab("reviews")}>
                Approve Reviews
              </Button>
              <Button variant="outline" className="border-lilla text-lilla hover:bg-lilla hover:text-white px-8 py-3 text-lg">
                Manage Users
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 text-lg" onClick={() => window.location.reload()}>
                Refresh Data
              </Button>
            </div>

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
              <Button className="bg-lilla hover:bg-lilla/90">Add New Restaurant</Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Restaurant management interface will be implemented here.</p>
                  <p className="text-sm text-gray-500">Features: Edit restaurant details, manage photos, update hours, etc.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "reviews" && stats && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Review Management</h2>
              <div className="flex gap-2">
                <Button variant="outline">Filter Reviews</Button>
                <Button className="bg-lilla hover:bg-lilla/90">Bulk Actions</Button>
              </div>
            </div>

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
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Review moderation interface will be implemented here.</p>
                  <p className="text-sm text-gray-500">Features: Approve/reject reviews, moderate content, view user reports, etc.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
