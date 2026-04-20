import type { Context } from "hono";
import { prismaService } from "../db/MariaDB";
import {
  REGISTER_JOB_SCHEMA,
  type REGISTER_JOB,
  type RegisterJobResult,
} from "./job.model";
export const JobService = {
  async GetAllJob() {},
  async PostJob(req: REGISTER_JOB, c: Context): Promise<RegisterJobResult> {
    const request = REGISTER_JOB_SCHEMA.parse(req);
    const user_id = c.get("user");
    const job = await prismaService.jobs.create({
      data: {
        poster_id: user_id.sub,
        title: request.title,
        budget: request.budget,
        description: request.description,
        category_id: request.category_id,
        status: request.status,
        deadline: request.deadline,
        location: request.location,
        work_type: request.work_type ?? null,
        commitment: request.commitment,
      },
      select: { title: true },
    });
    return {
      title: job.title,
    };
  },
};
