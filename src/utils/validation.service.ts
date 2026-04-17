import { ZodType } from "zod";
export const ValidationService = {
  validate<T>(zodType: ZodType<T>, data: T): T {
    return zodType.parse(data);
  },
};
