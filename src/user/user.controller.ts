import { Hono, type Context } from "hono";
import { userService } from "./user.service.ts";
import { HttpStatus } from "../utils/status_code.ts";

export const userController = new Hono();
userController.get("/", async (c: Context) => {
  const user = await userService.getAllUser();
  return c.json(user, HttpStatus.OK);
});
userController.get("/:id", async (c: Context) => {
  const id = c.req.param("id");
  const user = await userService.getUserById(id);
  return c.json(user, HttpStatus.OK);
});
