"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/Registerform";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const router = useRouter();

  const handleLoginSuccess = () => {
    // Redirect til forsiden efter succesfuld login
    router.push("/");
  };

  const handleRegisterSuccess = () => {
    // Skift til login form efter succesfuld registrering
    setMode("login");
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header med tabs */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button onClick={() => setMode("login")} className={`px-6 py-2 rounded-md font-medium transition-colors ${mode === "login" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}>
                Log ind
              </button>
              <button onClick={() => setMode("register")} className={`px-6 py-2 rounded-md font-medium transition-colors ${mode === "register" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`}>
                Opret konto
              </button>
            </div>
          </div>
        </div>

        {/* Form container */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">{mode === "login" ? <LoginForm onSuccess={handleLoginSuccess} /> : <RegisterForm onSuccess={handleRegisterSuccess} />}</div>
      </div>
    </div>
  );
}
