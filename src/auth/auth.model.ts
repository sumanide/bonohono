import * as z from "zod";

export const REGISTER_SCHEMA = z.object({
  email: z.string().email().min(1).max(100),
  password: z.string().min(8).max(100),
  first_name: z.string().min(4).max(100),
  last_name: z.string().min(4).max(100).nullable(),
});
export type REGISTER_USER_REQUEST = {
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
};

export const LOGIN_SCHEMA = z.object({
  email: z.string().email().min(1).max(100),
  password: z.string().min(8).max(100),
});
export type LOGIN_USER_REQUEST = {
  email: string;
  password: string;
};

export const RESET_PASSWORD_SCHEMA = z.object({
  email: z.string().email().min(1).max(100),
  password: z.string().min(8).max(100),
});
export type RESET_PASSWORD_REQUEST = {
  password: string;
};

export const DELETE_SCHEMA = z.object({
  email: z.string().email().min(1).max(100),
});

// RESPONSE
export type UserResponse = {
  email: string;
  first_name?: string;
};

export type UserResponseController = {
  data: UserResponse;
  status_code: number;
};

export type UserResponseQuery = {
  email: string;
  first_name: string;
};

export type JWT_PAYLOAD = {
  sub?: string;
  email?: string;
  role?: number | null | undefined;
  exp?: number;
  iat?: number;
};

export type JWT_RESPONSE = {
  id: string;
  email: string;
  first_name: string;
};
