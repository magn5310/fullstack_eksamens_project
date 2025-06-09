"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { registerSchema, registerFormData } from "@/lib/validations/auth";
import { FormField } from "@/components/ui/FormField";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<registerFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: registerFormData) => {
    try {
      setIsLoading(true);
      setServerError(null);

      await registerUser(data.email, data.password, data.firstName, data.lastName);

      console.log("Registration successful!");

      // Kald onSuccess callback hvis den er givet
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Registrering fejlede");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Image src={"/logo_transparant.svg"} alt="Kebabadvisor logo" height={300} width={300} className="m-auto"></Image>
        <CardTitle className="text-center">Kebabadvisor</CardTitle>
        <CardDescription className="text-center">Sign up to start reviewing!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField<registerFormData> label="Fornavn" name="firstName" type="text" register={register} error={errors.firstName} placeholder="Lars" />

            <FormField<registerFormData> label="Efternavn" name="lastName" type="text" register={register} error={errors.lastName} placeholder="Nielsen" />
          </div>

          <FormField<registerFormData> label="Email" name="email" type="email" register={register} error={errors.email} placeholder="din@email.dk" />

          <FormField<registerFormData> label="Password" name="password" type="password" register={register} error={errors.password} placeholder="Mindst 6 karakterer" />

          <FormField<registerFormData> label="Bekræft password" name="confirmPassword" type="password" register={register} error={errors.confirmPassword} placeholder="Gentag dit password" />

          {serverError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <div className="font-medium">Fejl ved registrering:</div>
              <pre className="whitespace-pre-wrap text-sm mt-1">{serverError}</pre>
            </div>
          )}

          <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Opretter konto..." : "Opret konto"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
