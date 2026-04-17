import { Hono } from "hono";
import { userService } from "./user.service.ts";

export const userController = new Hono();
userController.get();
userController.get("/users", async (c) => {
  const user = await userService.getAllUser();
  return c.json(user, 200);
});
userController.get("/users/:id", async (c) => {
  const id = c.req.param("id");
  const user = await userService.getUserById(id);
  return c.json(user, 200);
});
