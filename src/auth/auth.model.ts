import * as z from "zod";

export const REGISTER_SCHEMA = z.object({
  email: z.string().email().min(1).max(100),
  password: z.string().min(8).max(100),
  firstname: z.string().min(4).max(100),
  lastname: z.string().min(4).max(100).optional(),
});

export type REGISTER_USER_REQUEST = z.infer<typeof REGISTER_SCHEMA>;
