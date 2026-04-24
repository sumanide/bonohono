import { Hono, type Context } from "hono";
import { JobService } from "./job.service";
import { HttpStatus } from "../utils/status_code";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { HTTPException } from "hono/http-exception";

export const JobController = new Hono();
JobController.use(AuthMiddleware);
JobController.post("/", async (c: Context) => {
  const body = await c.req.json();
  const result = await JobService.PostJob(body, c);
  return c.json({
    data: result,
    status_code: HttpStatus.CREATED,
  });
});
JobController.get("/", async (c: Context) => {
  const result = await JobService.GetAllJob(c);
  return c.json({
    data: result,
    status_code: HttpStatus.OK,
  });
});
JobController.get("/categories/:category_id", async (c: Context) => {
  const rawId = c.req.param("category_id");
  if (!rawId || rawId === undefined) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "body not found",
    });
  }
  const id: string = rawId;
  const result = await JobService.GetJobIdWhereCategory(id, c);
  return c.json({
    data: result,
    status_code: HttpStatus.OK,
  });
});
JobController.get("/:id", async (c: Context) => {
  const rawId = c.req.param("id");
  if (!rawId) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Id undefined",
    });
  }
  const id: string = rawId;
  // console.dir(c.var, { depth: null });
  // console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(c)));
  const result = await JobService.GetJobById(id);
  return c.json({
    data: result,
    status_code: HttpStatus.OK,
  });
});
