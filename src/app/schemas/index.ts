import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message:"Password is requred"
    })
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message:"Minimum six characters required"
    }),
    confirmPassword: z.string().min(6, {
        message:"Minimum six characters required"
    })
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
}); 