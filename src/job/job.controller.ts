import { Hono, type Context } from "hono";
import { JobService } from "./job.service";
import { HttpStatus } from "../utils/status_code";
import { AuthMiddleware } from "../middleware/auth.middleware";

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
  const result = await JobService.GetAllJob();
  return c.json({
    data: result,
    status_code: HttpStatus.OK,
  });
});
JobController.get("/:id", async (c: Context) => {
  const body = await c.req.json();
  const result = await JobService.GetJobById(body);
  return c.json({
    data: result,
    status_code: HttpStatus.OK,
  });
});
