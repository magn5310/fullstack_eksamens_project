import { useEffect, useState } from "react";



export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/profile");
        setIsAuthenticated(res.ok);
      } catch (error) {
        setIsAuthenticated(false);
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);
  return { isAuthenticated, isLoading};
}