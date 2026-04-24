import type { Context } from "hono";
import { prismaService } from "../db/MariaDB";
import type { GetSavedJobResultQuery } from "../job/job.model";
import type { JWT_RESPONSE } from "../auth/auth.model";

export const SavedJobService = {
  async GetSavedJobByUserId(c: Context) {
    const user: JWT_RESPONSE = c.get("user");
    const saved_job = await prismaService.$queryRaw<GetSavedJobResultQuery>`
    SELECT
    sj.id as saved_job_id,
    sj.user_id,
    sj.job_id,
    sj.created_at as saved_at,
    j.id,
    j.poster_id,
    j.title,
    j.description,
    j.category_id,
    j.budget,
    j.status,
    j.deadline,
    j.location,
    j.created_at,
    j.updated_at,
        CASE
        WHEN u.last_name IS NULL
        OR u.last_name = "" THEN u.first_name
        ELSE CONCAT(
            u.first_name,
            " ",
            u.last_name
        )
    END as name,
    u.email as poster_email,
    u.avatar as poster_avatar
FROM
    saved_jobs as sj
    JOIN jobs as j ON sj.job_id = j.id
    JOIN users as u ON j.poster_id = u.id
WHERE
    sj.user_id = ${user.id}
ORDER BY sj.created_at DESC`;
    return saved_job;
  },
  async CreateSavedJob(c: Context, job_id: string) {
    const user: JWT_RESPONSE = c.get("user");
    const id = user.id;
    const job = await prismaService.saved_jobs.create({
      data: { user_id: id, job_id: job_id },
      select: { job_id: true },
    });
    return job;
  },
};
