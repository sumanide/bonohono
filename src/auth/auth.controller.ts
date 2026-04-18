import { Hono } from "hono";
import { authService } from "./auth.service";
import { LOGIN_SCHEMA, REGISTER_SCHEMA } from "./auth.model";
import { HttpStatus } from "../utils/status_code";

export const authController = new Hono();
authController.post("/auth/register", async (c) => {
  const body = await c.req.json();
  const validate = REGISTER_SCHEMA.parse(body);
  const result = await authService.register(validate);
  return c.json(result, HttpStatus.CREATED);
});
authController.post("/auth/login", async (c) => {
  const body = await c.req.json();
  const validate = LOGIN_SCHEMA.parse(body);
  const result = await authService.login(validate);
  return c.json(result, HttpStatus.OK);
});
authController.patch();
