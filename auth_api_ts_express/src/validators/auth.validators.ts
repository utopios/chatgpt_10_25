import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email().max(255),
    password: z.string().min(10).max(128),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().max(255),
    password: z.string().min(1),
  }),
});

export const refreshSchema = z.object({
  body: z.object({}).optional(),
});
