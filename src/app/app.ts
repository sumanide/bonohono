import { userController } from "../user/user.controller";
import { authController } from "../auth/auth.controller";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import { winstonlogger } from "../utils/winston-logger";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";
import { JobController } from "../job/job.controller";
import { SavedJobController } from "../saved_job/saved_job.controller";

export const app = new Hono();
app.use("/*", prettyJSON({ force: true }));
app.use("/*", logger());
app
  .basePath("/api")
  .route("/users", userController)
  .route("/auth", authController)
  .route("/jobs", JobController)
  .route("/saved-jobs", SavedJobController);

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
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      c.status(409);
      return c.json({
        errors:
          "There is a unique constraint violation, a new user cannot be created with this email",
      });
    } else {
      c.status(500);
      return c.json({
        errors: err.code,
      });
    }
  } else {
    c.status(500);
    return c.json({
      errors: err.message,
    });
  }
});

for (let i = 0; i < app.routes.length; i++) {
  const route = app.routes[i];
  winstonlogger.info(
    `[METHOD] ${route?.method.padEnd(6)} | [ROUTE] ${route?.path}`,
  );
}

winstonlogger.info("=======================================================");
