import { Hono, type Context } from "hono";
import { userService } from "./user.service.ts";
import { HttpStatus } from "../utils/status_code.ts";
import { AuthMiddleware } from "../middleware/auth.middleware.ts";

export const userController = new Hono();
userController.use(AuthMiddleware);
userController.get(async (c: Context) => {
  const user = await userService.getAllUser();
  return c.json({
    data: user,
    status_code: HttpStatus.OK,
  });
});
userController.get("/:id", async (c: Context) => {
  const id = c.req.param("id") as string;
  const user = await userService.getUserById(id);
  return c.json({
    data: user,
    status_code: HttpStatus.OK,
  });
});
