import { Hono, type Context } from "hono";
import { authService } from "./auth.service";
import {
  LOGIN_SCHEMA,
  REGISTER_SCHEMA,
  RESET_PASSWORD_SCHEMA,
} from "./auth.model";
import { HttpStatus } from "../utils/status_code";

export const authController = new Hono();
authController.post("/register", async (c: Context) => {
  const body = await c.req.json();
  const validate = REGISTER_SCHEMA.parse(body);
  const result = await authService.register(validate);
  return c.json({
    data: result,
    status_code: HttpStatus.CREATED,
  });
});
authController.post("/login", async (c: Context) => {
  const body = await c.req.json();
  const validate = LOGIN_SCHEMA.parse(body);
  const result = await authService.login(validate, c);
  return c.json({
    data: result,
    status_code: HttpStatus.OK,
  });
});
authController.get("/logout", async (c: Context) => {
  await authService.logout(c);
  return c.json({
    message: "Cookies cleared succesfully",
    status_code: HttpStatus.OK,
  });
});
authController.patch("/current", async (c: Context) => {
  const body = await c.req.json();
  const validate = RESET_PASSWORD_SCHEMA.parse(body);
  await authService.reset_password(validate, c);
  return c.json({
    message: "Pasword changed succesfully",
    status_code: HttpStatus.OK,
  });
});
