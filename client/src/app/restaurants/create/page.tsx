"use client";

import { useAuth } from "@/contexts/AuthContext";
import { CreateRestaurantForm } from "@/components/createRestaurantForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateRestaurantPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🔍 Auth Debug:", { user, isLoading });
    console.log("🍪 Auth Token:", localStorage.getItem("authToken"));
  }, [user, isLoading]);

  useEffect(() => {
    if (!isLoading && !user) {
      console.log(user);
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loader...</p>
        </div>
      </div>
    );
  }

  return <CreateRestaurantForm />;
}
