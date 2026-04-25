import { Hono, type Context } from "hono";
import { HttpStatus } from "../utils/status_code";
import { SavedJobService } from "./saved_job.service";
import { AuthMiddleware } from "../middleware/auth.middleware";
import type { CREATE_JOB_REQUEST } from "./saved_job.model";

export const SavedJobController = new Hono();
SavedJobController.use("*", AuthMiddleware);
SavedJobController.post("/", async (c: Context) => {
  const raw: CREATE_JOB_REQUEST = await c.req.json();
  const job_id: string = raw.job_id;
  const result = await SavedJobService.CreateSavedJob(c, job_id);
  c.status(HttpStatus.CREATED);
  return c.json({
    data: result,
    status_code: HttpStatus.CREATED,
  });
});
SavedJobController.get("/", async (c: Context) => {
  const result = await SavedJobService.GetSavedJobByUserId(c);
  return c.json({
    data: result,
    status_code: HttpStatus.CREATED,
  });
});
SavedJobController.delete("/", async (c: Context) => {
  await SavedJobService.DeleteSavedJob(c);
  return c.json({
    message: "Job delete from saved",
    status_code: HttpStatus.OK,
  });
});
