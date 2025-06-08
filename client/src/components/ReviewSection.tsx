"use client"
import ReviewForm from "./ReviewForm";
import { Button } from "./ui/button";
import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";

 // Adjust the import path as necessary
// Assuming you have a custom hook for authentication


    

export default function ReviewSection({ restaurantId }: { restaurantId: string }) {
  const [showForm, setShowForm] = useState(false);
    // Check if the user is authenticated by checking for a token in localStorage
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center mt-4">
        <p className="text-gray-500">Du skal være logget ind for at skrive en anmeldelse.</p>
      </div>
    );
    }



  return (
    <div className="flex flex-col items-center mt-4">
      <Button onClick={() => setShowForm(!showForm)} className="my-4">
        {showForm ? "Skjul anmeldelsesformular" : "Skriv en anmeldelse"}
      </Button>
      {showForm && <ReviewForm restaurantId={restaurantId} />}
    </div>
  );
}