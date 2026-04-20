import type { Decimal } from "@prisma/client/runtime/index-browser";
import {
  jobs_commitment,
  jobs_status,
  jobs_work_type,
} from "../../generated/prisma/enums";
import z from "zod";

export type REGISTER_JOB = {
  poster_id: string;
  title: string;
  budget: Decimal;
  description: string;
  category_id: string;
  status: jobs_status;
  deadline: Date;
  location: string;
  work_type?: jobs_work_type;
  comitment: jobs_commitment;
};

export const REGISTER_JOB_SCHEMA = z.object({
  poster_id: z.string().min(4),
  title: z.string().min(2).max(100),
  budget: z.number().positive(),
  description: z.string(),
  category_id: z.string(),
  status: z.enum(jobs_status),
  deadline: z.date(),
  location: z.string(),
  work_type: z.enum(jobs_work_type),
  commitment: z.enum(jobs_commitment),
});

export type RegisterJobResult = {
  title: string;
};
