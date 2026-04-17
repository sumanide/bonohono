import { Hono } from "hono";
import { authService } from "./auth.service";
import { REGISTER_SCHEMA } from "./auth.model";

export const authController = new Hono();
authController.post("/auth/register", async (c) => {
  const body = await c.req.json();
  console.log(body);
  const validate = REGISTER_SCHEMA.parse(body);
  const result = authService.register(validate);
  return c.json(result, 201);
});
