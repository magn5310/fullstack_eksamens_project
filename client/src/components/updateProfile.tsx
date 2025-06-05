"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


const formSchema = z.object({
    firstName: z.string().min(1, "Fornavn er påkrævet"),
    lastName: z.string().min(1, "Efternavn er påkrævet"),
    email: z.string().email("Ugyldig email").min(1, "Email er påkrævet"),
    password: z.string().min(6, "Adgangskode skal være mindst 6 tegn").optional(),
    confirmPassword: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Adgangskoderne skal matche",
    path: ["confirmPassword"],
})



export default function UpdateProfile() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    useEffect(() => {
        // Fetch current user data and set it as default values
        async function fetchUserData() {
            try {
                const res = await fetch("/api/profile");
                if (!res.ok) throw new Error("Failed to fetch user data");
                const data = await res.json();
                form.reset({
                    firstName: data.user.firstName || "",
                    lastName: data.user.lastName || "",
                    email: data.user.email || "",
                    password: "",
                    confirmPassword: "",
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUserData();

    }, [form])

    const router = useRouter()

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
          const res = await fetch("/api/profile/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const contentType = res.headers.get("Content-Type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Response is not JSON");
            }
      
          const result = await res.json();
          if (result.success) {
            toast.success("Profil opdateret succesfuldt");
            // Optionally, you can redirect or update the UI further
            router.push("/profile");
            
            
            
          } else {
            toast.error(result.message || "Der opstod en fejl under opdatering af profilen");
          }
        } catch (err) {
          console.error("Error submitting form", err);
          toast.error("Der opstod en fejl under opdatering af profilen");
        }
      }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Opdater Profil</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Fornavn</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="Indtast dit fornavn"
                                            className="input input-bordered w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Efternavn</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="Indtast dit efternavn"
                                            className="input input-bordered w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Email</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="email"
                                            placeholder="Indtast din email"
                                            className="input input-bordered w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Adgangskode</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="password"
                                            placeholder="Ny adgangskode (valgfri)"
                                            className="input input-bordered w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Bekræft adgangskode</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="password"
                                            placeholder="Gentag adgangskode"
                                            className="input input-bordered w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="btn btn-primary w-full mt-2">
                            Opdater Profil
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

