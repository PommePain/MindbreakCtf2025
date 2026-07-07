import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(4, {
        message: `Username must be at least 4 characters.`
    }).max(40),
    email: z.string().min(4, {
        message: `Email must be at least 4 characters.`
    }).max(255),
    password: z.string().min(6, {
        message: `Password must be at least 6 characters.`
    }).max(40)
});

export type RegisterUser = z.infer<typeof registerSchema>;