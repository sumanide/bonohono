import { Hono, type Context } from "hono";
import { authService } from "./auth.service";
import {
  type JWT_RESPONSE,
  type LOGIN_USER_REQUEST,
  type REGISTER_USER_REQUEST,
  type RESET_PASSWORD_REQUEST,
  type UserResponseController,
} from "./auth.model";
import { HttpStatus } from "../utils/status_code";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { HTTPException } from "hono/http-exception";

export const authController = new Hono();
authController.post("/", async (c: Context) => {
  const body: REGISTER_USER_REQUEST = await c.req.json();
  const result = await authService.register(body);
  c.status(HttpStatus.CREATED);
  return c.json<UserResponseController>({
    data: result,
    status_code: HttpStatus.CREATED,
  });
});
authController.post("/login", async (c: Context) => {
  const body: LOGIN_USER_REQUEST = await c.req.json();
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
  const user: JWT_RESPONSE = c.get("user");
  if (!user) {
    throw new HTTPException(HttpStatus.UNAUTHORIZED, {
      message: "UNAUTHORIZED",
    });
  }
  const body: RESET_PASSWORD_REQUEST = await c.req.json();
  await authService.resetPassword(body, user.email);
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
authController.delete("/delete_account", async (c: Context) => {
  const user: JWT_RESPONSE = c.get("user");
  await authService.deleteAccount(user.email);
  return c.json({
    message: "Account deleted succesfully",
    status_code: HttpStatus.OK,
  });
});
