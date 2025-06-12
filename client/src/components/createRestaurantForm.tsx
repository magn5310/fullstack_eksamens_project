"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRestaurantSchema, CreateRestaurantData } from "@/lib/validations/auth";
import { FormField } from "./ui/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface CreateRestaurantFormProps {
  onSuccess?: (restaurant: CreateRestaurantData) => void;
}

interface ErrorDetail {
  field: string;
  message: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function CreateRestaurantForm({ onSuccess }: CreateRestaurantFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  // const [success, setSuccess] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateRestaurantData>({
    resolver: zodResolver(createRestaurantSchema),
    mode: "onChange",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file first
      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large, max size is 5MB");
        return;
      }

      const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!acceptedTypes.includes(file.type)) {
        alert("Wrong file format. Must be jpeg, png, jpg or webp");
        return;
      }

      // Convert to base64 and set it
      const base64 = await fileToBase64(file);
      setValue("image", base64);
    }
  };
  const onSubmit = async (data: CreateRestaurantData) => {
    try {
      setIsLoading(true);
      setServerError(null);

      const restaurantData = {
        ...data,
      };

      const response = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurantData),
      });
      if (!response.ok) {
        const error = await response.json();

        if (error.details && Array.isArray(error.details)) {
          const errorMessages = error.details.map((detail: ErrorDetail) => `${detail.field}: ${detail.message}`).join("\n");
          throw new Error(errorMessages);
        }

        throw new Error(error.error || "Restaurant creation failed");
      }

      const result = await response.json();

      // setSuccess(true);
      reset();

      router.push(`/products/${result.restaurant.slug}`);

      if (onSuccess) {
        console.log("Calling onSuccess with:", result.restaurant);
        onSuccess(result.restaurant);
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Creation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-4">
      <Card className="max-w-md m-auto mt-10">
        <CardHeader>
          <CardTitle>Create Restaurant</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField<CreateRestaurantData> label="Restaurant name" name="name" register={register} error={errors.name} placeholder="Restaurants name" />
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Address</h3>

              <FormField<CreateRestaurantData> label="Address Line" name="addressLine" register={register} error={errors.addressLine} placeholder="e.g. Torvet 1" />

              <div className="grid grid-cols-2 gap-4">
                <FormField<CreateRestaurantData> label="Postal Code" name="postalCode" register={register} error={errors.postalCode} placeholder="1208" />

                <FormField<CreateRestaurantData> label="City" name="city" register={register} error={errors.city} placeholder="København K" />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea id="description" rows={4} {...register("description")} placeholder="Descripe" className={`w-full px-3 py-2 border rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? "border-red-500" : "border-gray-300"}`} />
              {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Opening Hours</h3>            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <div>
                <label htmlFor="openingHour" className="block text-sm font-medium text-gray-700 mb-1">Opening Hour</label>
                <select id="openingHour" {...register("openingHour", { valueAsNumber: true })} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.openingHour ? "border-red-500" : "border-gray-300"}`}>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {errors.openingHour && <p className="text-sm text-red-600 mt-1">{errors.openingHour.message}</p>}
              </div>

              <div>
                <label htmlFor="openingMinute" className="block text-sm font-medium text-gray-700 mb-1">Opening Minute</label>
                <select id="openingMinute" {...register("openingMinute", { valueAsNumber: true })} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.openingMinute ? "border-red-500" : "border-gray-300"}`}>
                  {[0, 15, 30, 45].map((minute) => (
                    <option key={minute} value={minute}>
                      {minute.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {errors.openingMinute && <p className="text-sm text-red-600 mt-1">{errors.openingMinute.message}</p>}
              </div>

              <div>
                <label htmlFor="closingHour" className="block text-sm font-medium text-gray-700 mb-1">Closing Hour</label>
                <select id="closingHour" {...register("closingHour", { valueAsNumber: true })} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.closingHour ? "border-red-500" : "border-gray-300"}`}>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {errors.closingHour && <p className="text-sm text-red-600 mt-1">{errors.closingHour.message}</p>}
              </div>

              <div>
                <label htmlFor="closingMinute" className="block text-sm font-medium text-gray-700 mb-1">Closing Minute</label>
                <select id="closingMinute" {...register("closingMinute", { valueAsNumber: true })} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.closingMinute ? "border-red-500" : "border-gray-300"}`}>
                  {[0, 15, 30, 45].map((minute) => (
                    <option key={minute} value={minute}>
                      {minute.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {errors.closingMinute && <p className="text-sm text-red-600 mt-1">{errors.closingMinute.message}</p>}              </div>
            </div>
            </div>
            <FormField<CreateRestaurantData> label="Phone" name="phone" type="tel" register={register} error={errors.phone} placeholder="12345678" />
            <FormField<CreateRestaurantData> label="Website (optional)" name="website" register={register} error={errors.website} placeholder="example.com" />

            <label className="block text-sm font-medium text-gray-700">Restaurant Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image?.message?.toString()}</p>}

            {serverError && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <div className="font-medium">Error:</div>
                <pre className="whitespace-pre-wrap text-sm mt-1">{serverError}</pre>
              </div>
            )}            <button type="submit" className="w-full cursor-pointer py-3 px-4 border border-transparent rounded-sm shadow-sm text-lg font-medium text-white bg-blue-600">
              {isLoading ? "Creating restaurant" : "Create restaurant"}
            </button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
