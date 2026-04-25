import type { Context } from "hono";
import { prismaService } from "../db/MariaDB";
import {
  REGISTER_JOB_SCHEMA,
  type REGISTER_JOB,
  type GetJobResult,
  type GET_JOB_BY_CATEGORY_REQUEST,
  GET_JOB_BY_CATEGORY_SCHEMA,
} from "./job.model";
import { winstonlogger } from "../utils/winston-logger";
import { HTTPException } from "hono/http-exception";
import { HttpStatus } from "../utils/status_code";
import type { JWT_RESPONSE } from "../auth/auth.model";

export const JobService = {
  async GetAllJob(c: Context): Promise<GetJobResult[]> {
    const user = c.get("user");
    if (!user) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Unauthorized",
      });
    }
    const jobs = await prismaService.jobs.findMany();
    return jobs;
  },
  async GetJobIdWhereCategory(req: string, c: Context) {
    const user = c.get("user");

    if (!user) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Unauthorized",
      });
    }

    const result = await prismaService.jobs.findMany({
      select: {
        title: true,
        description: true,
        budget: true,
        status: true,
        deadline: true,
        location: true,
        work_type: true,
        commitment: true,
        skills: true,
        experience_level: true,
        payment_type: true,
        categories: {
          select: {
            name: true,
            description: true,
          },
        },
      },
      where: { category_id: req },
    });

    if (!result) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "data not found",
      });
    }

    return result;
  },
  async PostJob(req: REGISTER_JOB, c: Context): Promise<GetJobResult> {
    const request = REGISTER_JOB_SCHEMA.parse(req);
    const user: JWT_RESPONSE = c.get("user");
    if (!user.id || user.id === undefined) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }
    if (user.poster !== 1) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "role must be poster",
      });
    }
    winstonlogger.debug(user.id);
    const job = await prismaService.jobs.create({
      data: {
        poster_id: user.id,
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
    });
    return {
      id: job.id,
      poster_id: job.poster_id,
      title: job.title,
      description: job.description,
      category_id: job.category_id,
      budget: job.budget,
      status: job.status,
      deadline: job.deadline,
      location: job.location,
      work_type: job.work_type,
      commitment: job.commitment,
      experience_level: job.experience_level,
      payment_type: job.payment_type,
      skills: job.skills,
      created_at: job.created_at,
      updated_at: job.updated_at,
    };
  },
  async GetJobById(id: string): Promise<GetJobResult> {
    console.log(id);
    winstonlogger.debug("executed: ");
    const jobs = await prismaService.jobs.findUnique({
      where: { id: id },
    });
    if (!jobs) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "Job not found",
      });
    }
    return {
      id: jobs.id,
      poster_id: jobs.poster_id,
      title: jobs.title,
      description: jobs.description,
      category_id: jobs.category_id,
      budget: jobs.budget,
      status: jobs.status,
      deadline: jobs.deadline,
      location: jobs.location,
      work_type: jobs.work_type,
      commitment: jobs.commitment,
      experience_level: jobs.experience_level,
      payment_type: jobs.payment_type,
      skills: jobs.skills,
      created_at: jobs.created_at,
      updated_at: jobs.updated_at,
    };
  },
};
