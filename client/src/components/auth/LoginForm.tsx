"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { FormField } from "@/components/ui/FormField";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setServerError(null);

      await login(data.email, data.password);

      console.log("Login successful!");

      // Kald onSuccess callback hvis den er givet
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Login fejlede");
      toast.error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Image src={"/logo_transparant.svg"} alt="Kebabadvisor logo" height={300} width={300} className="m-auto"></Image>
        <CardTitle className="text-center">Kebabadvisor</CardTitle>
        <CardDescription className="text-center">Log in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField<LoginFormData> label="Email" name="email" type="email" register={register} error={errors.email} placeholder="your@email.com" />

          <FormField<LoginFormData> label="Password" name="password" type="password" register={register} error={errors.password} placeholder="Your password" />

          {serverError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{serverError}</div>}

          <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
