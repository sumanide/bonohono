import { userController } from "../user/user.controller";
import { authController } from "../auth/auth.controller";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import figlet from "figlet";

export const app = new Hono();
app.use(prettyJSON({ force: true }));

app.use(logger());
app
  .basePath("/api")
  .route("/users", userController)
  .route("/auth", authController);

const body = figlet.textSync("saken");
console.log(body);

for (let i = 0; i < app.routes.length; i++) {
  console.log(`routes: ${app.routes[i]?.path}`);
}
