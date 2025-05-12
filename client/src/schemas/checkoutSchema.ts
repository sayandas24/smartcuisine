import { z } from "zod";

export const checkoutSchema = z.object({
    name: z.string().min(1, "Name is required"),
    mobileNumber: z.string()
        .refine(val => !val || val.length === 10, "Mobile number should be exactly 10 digits")
        .refine(val => !val || /^\d+$/.test(val), "Mobile number should only contain digits")
        .optional(),
    email: z.string().min(1, "Email is required").refine((val) => {
        if (!val) return true;
        return z.string().email("Invalid email address").safeParse(val).success;
    }, "Invalid email address"),
    note: z.string().optional(),
    paymentMethod: z.string().min(1, "Payment method is required"),
})