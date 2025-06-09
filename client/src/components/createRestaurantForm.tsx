"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRestaurantSchema, CreateRestaurantData } from "@/lib/validations/auth";
import { FormField } from "./ui/FormField";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CreateRestaurantFormProps {
  onSuccess?: (restaurant: CreateRestaurantData) => void;
}

export function CreateRestaurantForm({ onSuccess }: CreateRestaurantFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateRestaurantData>({
    resolver: zodResolver(createRestaurantSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: CreateRestaurantData) => {
    try {
      setIsLoading(true);
      setServerError(null);

      const response = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();

        if (error.details && Array.isArray(error.details)) {
          const errorMessages = error.details.map((detail: any) => `${detail.field}: ${detail.message}`).join("\n");
          throw new Error(errorMessages);
        }

        throw new Error(error.erorr || "Restaurant creation failed");
      }

      const result = await response.json();

      setSuccess(true);
      reset();

      if (onSuccess) {
        onSuccess(result.restaurant);
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Creation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Restaurant</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField<CreateRestaurantData> label="Restaurant name" name="name" register={register} error={errors.name} placeholder="Restaurants name" />
          <FormField<CreateRestaurantData> label="Address" name="address" register={register} error={errors.address} placeholder="Torvet 1, 1208 København K" />
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea id="description" rows={4} {...register("description")} placeholder="Descripe" className={`w-full px-3 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? "border-red-500" : "border-gray-300"}`} />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
          </div>
          <FormField<CreateRestaurantData> label="Opening hours" name="openHours" register={register} error={errors.openHours} placeholder="9-20" />
          <FormField<CreateRestaurantData> label="Phone" name="phone" type="tel" register={register} error={errors.phone} placeholder="12345678" />

          <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-sm shadow-sm text-lg font-medium text-white bg-blue-600">
            {isLoading ? "Creating reataurant" : "Create restaurant"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
