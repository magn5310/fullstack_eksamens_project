"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface AuthContextType {
  user: { id: string; email: string; firstName: string; lastName: string; role: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
}

interface ValidationErrorDetail {
  message: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);

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

    const data = await response.json();
    setUser(data.user);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName, confirmPassword: password }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("API Error:", error);

      if (error.details) {
        const errorMessages = error.details.map((detail: ValidationErrorDetail) => detail.message).join(", ");
        throw new Error(errorMessages);
      }

      throw new Error(error.error || "Registration failed");
    }

    const data = await response.json();
    setUser(data.user);
  };

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, register }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
