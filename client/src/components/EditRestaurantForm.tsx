"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  openHours: z.string().optional(),
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

import { useAuth } from "@/contexts/AuthContext";

// Brug types fra AuthContext i stedet for at definere dem igen
type Restaurant = NonNullable<NonNullable<ReturnType<typeof useAuth>["user"]>["restaurants"]>[0];

interface EditRestaurantFormProps {
  restaurant: Restaurant;
}

export default function EditRestaurantForm({ restaurant }: EditRestaurantFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: restaurant.name || "",
      description: restaurant.description || "",
      address: restaurant.address || "",
      phone: restaurant.phone || "",
      website: restaurant.website || "",
      openHours: restaurant.openHours || "",
    },
  });

  async function onSubmit(data: RestaurantFormData) {
    try {
      setSaving(true);
      const res = await fetch(`/api/restaurant/${restaurant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Restaurant updated successfully");
        router.push("/my-restaurants");
        router.refresh(); // Refresh server components
      } else {
        toast.error(result.message || "Failed to update restaurant");
      }
    } catch (err) {
      console.error("Error submitting form", err);
      toast.error("An error occurred while updating the restaurant. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="mb-6">
        <Link href="/my-restaurants" className="text-lilla hover:text-lilla/80 font-medium">
          ← Back to My Restaurants
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Edit Restaurant: {restaurant.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Navn</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Restaurant name" disabled={saving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beskrivelse</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Descripe your restaurant..." rows={4} disabled={saving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Type address" disabled={saving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Type Phonenumber" disabled={saving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com" disabled={saving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="openHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening hours (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Man-Fri: 10:00-22:00&#10;Sat-Sun: 12:00-20:00"
                        rows={3}
                        disabled={saving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.push("/my-restaurants")} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-lilla hover:bg-lilla/90" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
