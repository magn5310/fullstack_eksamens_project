"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data - erstat med rigtige API calls senere
const mockStats = {
  totalUsers: 1250,
  activeUsers: 325,
  pendingReviews: 71,
  approvedReviews: 2840,
  totalRestaurants: 85,
  totalReviews: 6578,
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "restaurants" | "reviews">("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Kebabadvisor</h1>
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
        </div>

        {activeTab === "dashboard" && (
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
                    <div className="text-4xl font-bold text-gray-900 mb-1">{mockStats.totalUsers.toLocaleString()}</div>
                    <div className="text-gray-600">Total Users</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">{mockStats.activeUsers.toLocaleString()}</div>
                    <div className="text-gray-600">Active Users</div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Card */}
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">{mockStats.pendingReviews}</div>
                    <div className="text-gray-600">Pending</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">{mockStats.approvedReviews.toLocaleString()}</div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">{mockStats.totalRestaurants}</div>
                    <div className="text-gray-600">Restaurants</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">{mockStats.totalReviews.toLocaleString()}</div>
                    <div className="text-gray-600">Reviews</div>
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
            </div>
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

        {activeTab === "reviews" && (
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
                <div className="text-2xl font-bold text-orange-600">{mockStats.pendingReviews}</div>
                <div className="text-sm text-gray-600">Pending Approval</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-green-600">{mockStats.approvedReviews.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-red-600">23</div>
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
