import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .regex(/^[a-zA-ZæøåÆØÅ]+$/, "First name can only contain letters"),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .regex(/^[a-zA-ZæøåÆØÅ]+$/, "Last name can only contain letters"),

    email: z.string().min(1, "Email is required").email("Invalid email format"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-ZÆØÅ]/, "Password must contain at least one uppercase letter")
      .regex(/[a-zæøå]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type registerFormData = z.infer<typeof registerSchema>;

export const createRestaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required").min(2, "Name must be atleast 2 characters").max(100, "Name can't be more than 100 characters"),
  address: z.string().min(1, "Address is required").min(5, "Address must be atleast 5 characters").max(200, "Address can maximum be 200 Characters"),
  description: z.string().min(1, "Description is required").min(10, "Description must be atleast 10 characters").max(1000, "Description can maximum be 1000 characters"),
  openHours: z.string().min(1, "Opening hours is required").min(4, "Opening hours must be atleast 4 characters").max(20, "Opening hours can maximum be 20 characters"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[\+]?[\d\s\-\(\)]{8,15}$/, "Invalid phone number"),
  website: z
    .string()
    .min(1, "Website is required")
    .url("Invalid website URL")
    .refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
      message: "URL must start with http:// or https://",
    }),
});

export type CreateRestaurantData = z.infer<typeof createRestaurantSchema>;
