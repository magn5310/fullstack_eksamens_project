"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { registerSchema, registerFormData } from "@/lib/validations/auth";
import { FormField } from "@/components/ui/FormField";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  // const [serverError, setServerError] = useState<string | null>(null);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: registerFormData) => {
    try {
      setIsLoading(true);
      // setServerError(null);

      await registerUser(data.email, data.password, data.firstName, data.lastName, data.confirmPassword);

      console.log("Registration successful!");
      toast.success("Registration successful");

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      // setServerError(errorMessage);
      toast.error(errorMessage); // Fix: Use the errorMessage, not serverError
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Image src={"/logo_transparant.svg"} alt="Kebabadvisor logo" height={100} width={100} className="m-auto"></Image>
        <CardTitle className="text-center text-3xl">Kebabadvisor</CardTitle>
        <CardDescription className="text-center">Sign up to start reviewing!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField<registerFormData> label="First Name" name="firstName" type="text" register={register} error={errors.firstName} placeholder="Lars" />

            <FormField<registerFormData> label="Last Name" name="lastName" type="text" register={register} error={errors.lastName} placeholder="Nielsen" />
          </div>

          <FormField<registerFormData> label="Email" name="email" type="email" register={register} error={errors.email} placeholder="your@email.com" />

          <FormField<registerFormData> label="Password" name="password" type="password" register={register} error={errors.password} placeholder="Minimum 8 characters" />

          <FormField<registerFormData> label="Confirm password" name="confirmPassword" type="password" register={register} error={errors.confirmPassword} placeholder="Repeat your password" />

          <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
