import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginFormData = z.infer<typeof loginSchema>;
export declare const registerSchema: z.ZodEffects<z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
}>, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
}, {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
}>;
export type registerFormData = z.infer<typeof registerSchema>;
export declare const createRestaurantSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodString;
    addressLine: z.ZodString;
    postalCode: z.ZodString;
    city: z.ZodString;
    description: z.ZodString;
    openingHour: z.ZodNumber;
    openingMinute: z.ZodNumber;
    closingHour: z.ZodNumber;
    closingMinute: z.ZodNumber;
    phone: z.ZodString;
    website: z.ZodOptional<z.ZodString>;
    image: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    addressLine: string;
    postalCode: string;
    city: string;
    description: string;
    openingHour: number;
    openingMinute: number;
    closingHour: number;
    closingMinute: number;
    phone: string;
    image: string;
    website?: string | undefined;
}, {
    name: string;
    addressLine: string;
    postalCode: string;
    city: string;
    description: string;
    openingHour: number;
    openingMinute: number;
    closingHour: number;
    closingMinute: number;
    phone: string;
    image: string;
    website?: string | undefined;
}>, {
    name: string;
    addressLine: string;
    postalCode: string;
    city: string;
    description: string;
    openingHour: number;
    openingMinute: number;
    closingHour: number;
    closingMinute: number;
    phone: string;
    image: string;
    website?: string | undefined;
}, {
    name: string;
    addressLine: string;
    postalCode: string;
    city: string;
    description: string;
    openingHour: number;
    openingMinute: number;
    closingHour: number;
    closingMinute: number;
    phone: string;
    image: string;
    website?: string | undefined;
}>;
export type CreateRestaurantData = z.infer<typeof createRestaurantSchema>;
//# sourceMappingURL=auth.d.ts.map