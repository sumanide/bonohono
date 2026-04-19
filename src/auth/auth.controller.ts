import { Hono, type Context } from "hono";
import { authService } from "./auth.service";
import {
  type LOGIN_USER_REQUEST,
  type REGISTER_USER_REQUEST,
  RESET_PASSWORD_SCHEMA,
  type UserResponseController,
} from "./auth.model";
import { HttpStatus } from "../utils/status_code";
import { AuthMiddleware } from "../middleware/auth.middleware";

export const authController = new Hono();
authController.post(async (c: Context) => {
  const body = (await c.req.json()) as REGISTER_USER_REQUEST;
  const result = await authService.register(body);
  return c.json<UserResponseController>({
    data: result,
    status_code: HttpStatus.CREATED,
  });
});
authController.post("/login", async (c: Context) => {
  const body = (await c.req.json()) as LOGIN_USER_REQUEST;
  const result = await authService.login(body, c);
  return c.json({
    data: result,
    status_code: HttpStatus.OK,
  });
});
authController.use(AuthMiddleware);
authController.get("/me", async (c: Context) => {
  const result = await authService.me(c);
  return c.json({
    data: result.data,
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
authController.delete("/current", async (c: Context) => {
  await authService.logout(c);
  return c.json({
    message: "Cookies cleared succesfully",
    status_code: HttpStatus.OK,
  });
});
