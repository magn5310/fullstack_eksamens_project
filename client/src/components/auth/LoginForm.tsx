"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { FormField } from "@/components/ui/FormField";
import { toast } from "sonner";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth(); // Du har brug for dette til at kalde login funktionen

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setServerError(null);

      await login(data.email, data.password);

      console.log("Login successful!");
      toast.success("Login successful!");
      // Her kan du redirect eller opdatere UI
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Login fejlede");
      toast.error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Log ind</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField<LoginFormData> label="Email" name="email" type="email" register={register} error={errors.email} placeholder="din@email.dk" />

        <FormField<LoginFormData> label="Password" name="password" type="password" register={register} error={errors.password} placeholder="Dit password" />

        {serverError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{serverError}</div>}

        <button type="submit" disabled={!isValid || isLoading} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? "Logger ind..." : "Log ind"}
        </button>
      </form>
    </div>
  );
}
