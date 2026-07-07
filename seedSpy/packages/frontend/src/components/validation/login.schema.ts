import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(4, {
    message: `Username must be at least ${4} characters.`
  }).max(40),
  password: z.string().min(6, {
    message: `Password must be at least 6 characters.`
  }).max(40)
});

export type LoginUser = z.infer<typeof loginSchema>;