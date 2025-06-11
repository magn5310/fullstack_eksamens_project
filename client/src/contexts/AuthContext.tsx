"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import {useRouter} from "next/navigation"

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  address?: string;
  phone?: string;
  website?: string;
  openHours?: string;
  createdAt: string;
  reviews: Review[];
}

interface Review {
  id: string;
  restaurantId: string;
  comment: string | null;
  createdAt: string;
  tasteScore: number;
  serviceScore: number;
  priceScore: number;
  title: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  status: "PENDING" | "APPROVED" | "REJECTED";
  reported?: boolean;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  reviews?: Review[];
  restaurants?: Restaurant[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface ValidationErrorDetail {
  message: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const Router = useRouter();

  // Check hvis bruger allerede er logget ind når appen loader
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include", // Inkluder cookies
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Inkluder cookies
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();
    setUser(data.user);
  };
  const register = async (email: string, password: string, firstName: string, lastName: string, confirmPassword: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName, confirmPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("API Error:", error);

        // Handle specific error cases
        if (error.code === "USER_EXISTS" || error.code === "DUPLICATE_EMAIL") {
          throw new Error("A user with this email already exists. Please try logging in instead.");
        }

        // Handle validation errors
        if (error.details) {
          const errorMessages = error.details.map((detail: ValidationErrorDetail) => detail.message).join(", ");
          throw new Error(errorMessages);
        }

        // Handle general errors
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);

      Router.push("/login"); // Redirect to login page after logout

    }
  };

  const value = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
