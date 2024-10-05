import { z } from "zod";

export const todoSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 characters.")
    .max(255, "Name must be at most 255 characters."),
  created_at: z.string().or(z.date().default(new Date())).optional(),
  update_at: z.string().or(z.date().default(new Date())).optional(),
  status: z.number().optional().default(0),
});
