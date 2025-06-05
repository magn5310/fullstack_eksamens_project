"use client";

import { createContext, useContext, ReactNode } from "react";

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
}

interface ValidationErrorDetail {
  message: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName, confirmPassword: password }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("API Error:", error); // DEBUG LINE

      // Vis detaljerede validation errors hvis det er Zod fejl
      if (error.details) {
        const errorMessages = error.details.map((detail: ValidationErrorDetail) => detail.message).join(", ");
        throw new Error(errorMessages);
      }

      throw new Error(error.error || "Registration failed");
    }
  };

  return <AuthContext.Provider value={{ login, register }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
