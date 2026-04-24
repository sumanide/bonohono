import type { Context } from "hono";
import { prismaService } from "../db/MariaDB";
import type { GetSavedJobResultQuery } from "../job/job.model";

export const SavedJobService = {
  async GetSavedJobByUserId(user_id: string) {
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
    GROUP_CONCAT(u.first_name, "", u.last_name) as name,
    u.email as poster_email,
    u.avatar as poster_avatar
FROM
    saved_jobs as sj
    JOIN jobs as j ON sj.job_id = j.id
    JOIN users as u ON j.poster_id = u.id
WHERE
    sj.user_id = ${user_id}
ORDER BY sj.created_at DESC`;
    return saved_job;
  },
  async CreateSavedJob(c: Context, job_id: string) {
    const user_id = c.get("user");
    const job = await prismaService.saved_jobs.create({
      data: { user_id: user_id, job_id: job_id },
      select: { job_id: true },
    });
    return job;
  },
};
