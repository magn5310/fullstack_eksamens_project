"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/Registerform";
import * as Sentry from "@sentry/nextjs";
// Import Sentry for error tracking

try {
  // something that fails
  throw new Error("This is a test error for Sentry");
}
catch (error) {
  Sentry.captureException(error);
  console.error("Sentry error captured:", error);
}

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

          <h2 className="text-3xl font-bold text-gray-900 mb-2">{mode === "login" ? "Velkommen tilbage!" : "Opret din konto"}</h2>
          <p className="text-gray-600">{mode === "login" ? "Log ind for at se dine anmeldelser og favoritter" : "Bliv medlem og del dine kebab oplevelser"}</p>
        </div>

        {/* Form container */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {mode === "login" ? <LoginForm onSuccess={handleLoginSuccess} /> : <RegisterForm onSuccess={handleRegisterSuccess} />}

          {/* Switch mode link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === "login" ? (
                <>
                  Har du ikke en konto?{" "}
                  <button onClick={switchMode} className="text-green-600 hover:text-green-500 font-medium">
                    Opret en her
                  </button>
                </>
              ) : (
                <>
                  Har du allerede en konto?{" "}
                  <button onClick={switchMode} className="text-blue-600 hover:text-blue-500 font-medium">
                    Log ind her
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Success messages */}
        {mode === "login" && (
          <div className="text-center">
            <p className="text-sm text-gray-500">Efter login bliver du sendt til forsiden</p>
          </div>
        )}
      </div>
    </div>
  );
}
