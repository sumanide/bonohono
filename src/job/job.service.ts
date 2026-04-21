import type { Context } from "hono";
import { prismaService } from "../db/MariaDB";
import {
  REGISTER_JOB_SCHEMA,
  type REGISTER_JOB,
  type RegisterJobResult,
  type GetAllJobResult,
} from "./job.model";
import { winstonlogger } from "../utils/winston-logger";
export const JobService = {
  async GetAllJob(): Promise<GetAllJobResult[]> {
    const jobs = await prismaService.jobs.findMany();
    return jobs;
  },
  async PostJob(req: REGISTER_JOB, c: Context): Promise<RegisterJobResult> {
    const request = REGISTER_JOB_SCHEMA.parse(req);
    const user_id = c.get("user");
    winstonlogger.debug(user_id.sub);
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
