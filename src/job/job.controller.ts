import { Hono, type Context } from "hono";
import { JobService } from "./job.service";
import { HttpStatus } from "../utils/status_code";
import { winstonlogger } from "../utils/winston-logger";
import { AuthMiddleware } from "../middleware/auth.middleware";

export const JobController = new Hono();
JobController.use(AuthMiddleware);
JobController.post("/", async (c: Context) => {
  const body = await c.req.json();
  winstonlogger.info(body);
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
