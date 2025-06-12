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

export const createRestaurantSchema = z
  .object({
    name: z.string().min(1, "Restaurant name is required").min(2, "Name must be at least 2 characters").max(100, "Name cannot be longer than 100 characters"),

    addressLine: z.string().min(1, "Address line is required").min(3, "Address line must be at least 3 characters").max(100, "Address line cannot be longer than 100 characters"),

    postalCode: z
      .string()
      .min(1, "Postal code is required")
      .regex(/^\d{4}$/, "Postal code must be 4 digits"),

    city: z.string().min(1, "City is required").min(2, "City must be at least 2 characters").max(50, "City cannot be longer than 50 characters"),

    description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters").max(1000, "Description cannot be longer than 1000 characters"),

    openingHour: z.number().min(0, "Opening hour must be between 0-23").max(23, "Opening hour must be between 0-23"),

    openingMinute: z.number().min(0, "Opening minute must be between 0-59").max(59, "Opening minute must be between 0-59"),

    closingHour: z.number().min(0, "Closing hour must be between 0-23").max(23, "Closing hour must be between 0-23"),

    closingMinute: z.number().min(0, "Closing minute must be between 0-59").max(59, "Closing minute must be between 0-59"),

    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[\+]?[\d\s\-\(\)]{8,15}$/, "Invalid phone number format"),

    website: z
      .string()
      .regex(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}$/, "Invalid website url")
      .optional(),

    image: z.string().min(1, "Restaurant image is required"),
  })
  .refine(
    (data) => {
      const openingMinutes = data.openingHour * 60 + data.openingMinute;
      const closingMinutes = data.closingHour * 60 + data.closingMinute;
      return closingMinutes > openingMinutes;
    },
    {
      message: "Closing time must be after opening time",
      path: ["closingHour"],
    }
  );

export type CreateRestaurantData = z.infer<typeof createRestaurantSchema>;
