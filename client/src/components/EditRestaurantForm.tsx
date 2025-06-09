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
  name: z.string().min(1, "Restaurant navn er påkrævet"),
  description: z.string().min(1, "Beskrivelse er påkrævet"),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("Ugyldig website URL").optional().or(z.literal("")),
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
        toast.success("Restaurant opdateret succesfuldt");
        router.push("/my-restaurants");
        router.refresh(); // Refresh server components
      } else {
        toast.error(result.message || "Der opstod en fejl under opdatering");
      }
    } catch (err) {
      console.error("Error submitting form", err);
      toast.error("Der opstod en fejl under opdatering af restauranten");
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
                      <Input {...field} placeholder="Indtast restaurant navn" disabled={saving} />
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
                      <Textarea {...field} placeholder="Beskriv din restaurant..." rows={4} disabled={saving} />
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
                    <FormLabel>Adresse (valgfri)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Indtast adresse" disabled={saving} />
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
                    <FormLabel>Telefon (valgfri)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Indtast telefonnummer" disabled={saving} />
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
                    <FormLabel>Website (valgfri)</FormLabel>
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
                    <FormLabel>Åbningstider (valgfri)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Man-Fre: 10:00-22:00&#10;Lør-Søn: 12:00-20:00"
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
                  Annuller
                </Button>
                <Button type="submit" className="flex-1 bg-lilla hover:bg-lilla/90" disabled={saving}>
                  {saving ? "Gemmer..." : "Gem Ændringer"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
