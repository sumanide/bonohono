import { userController } from "../user/user.controller";
import { authController } from "../auth/auth.controller";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import figlet from "figlet";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

export const app = new Hono();
app.use("/*", prettyJSON({ force: true }));
app.use("/*", logger());
app
  .basePath("/api")
  .route("/users", userController)
  .route("/auth", authController);

app.onError(async (err, c) => {
  if (err instanceof HTTPException) {
    c.status(err.status);
    return c.json({
      errors: err.message,
    });
  } else if (err instanceof ZodError) {
    c.status(400);
    return c.json({
      errors: err.issues,
    });
  } else {
    c.status(500);
    return c.json({
      errors: err.message,
    });
  }
});

const body = figlet.textSync("saken");
console.log(body);

for (let i = 0; i < app.routes.length; i++) {
  console.log(`routes: ${app.routes[i]?.path}`);
}
