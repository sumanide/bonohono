import { Hono, type Context } from "hono";
import { JobService } from "../job/job.service";
import { HttpStatus } from "../utils/status_code";

export const SavedJobController = new Hono();
SavedJobController.post("/", async (c: Context) => {
  const job_id: string = await c.req.json();
  const result = await JobService.CreateSavedJob(c, job_id);
  return c.json({
    data: result,
    status_code: HttpStatus.CREATED,
  });
});
SavedJobController.get("/", async (c: Context) => {
  const user_id = await c.req.json();
  console.log(user_id);
  const result = await JobService.GetSavedJobByUserId(user_id);
  return c.json({
    data: result,
    status_code: HttpStatus.CREATED,
  });
});
