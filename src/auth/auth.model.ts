import * as z from "zod";

export const REGISTER_SCHEMA = z.object({
  email: z.string().email().min(1).max(100),
  password: z.string().min(8).max(100),
  first_name: z.string().min(4).max(100),
  last_name: z.string().min(4).max(100).optional(),
});

export const LOGIN_SCHEMA = z.object({
  email: z.string().email().min(1).max(100),
  password: z.string().min(8).max(100),
});

export const RESET_PASSWORD_SCHEMA = z.object({
  password: z.string().min(8).max(100),
});

export type UserResponse = {
  email: string;
  firstname?: string;
};

export type UserResponseController = {
  data: UserResponse;
  status_code: number;
};

export type UserResponseQuery = {
  email: string;
  first_name: string;
};

export type REGISTER_USER_REQUEST = z.infer<typeof REGISTER_SCHEMA>;
export type LOGIN_USER_REQUEST = z.infer<typeof LOGIN_SCHEMA>;
export type RESET_PASSWORD_REQUEST = z.infer<typeof RESET_PASSWORD_SCHEMA>;

export type JWT_PAYLOAD = {
  sub?: string;
  email?: string;
  role?: number | null | undefined;
  exp?: number;
  iat?: number;
};
