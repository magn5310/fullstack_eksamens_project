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
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    confirmPassword: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
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
                <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">First Name</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="Enter your first name"
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
                                    <FormLabel className="text-gray-700">Last Name</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="Enter your last name"
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
                                            placeholder="Enter your email"
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
                                    <FormLabel className="text-gray-700">Password</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="password"
                                            placeholder="New password (optional)"
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
                                    <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="password"
                                            placeholder="Repeat password"
                                            className="input input-bordered w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="btn btn-primary w-full mt-2">
                            Update Profile
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

