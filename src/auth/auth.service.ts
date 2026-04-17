import { prismaService } from "../db/MariaDB";
import { type REGISTER_USER_REQUEST } from "./auth.model";

export const authService = {
  async register(req: REGISTER_USER_REQUEST) {
    const result = await prismaService.$executeRaw`
insert into
    users (
        email,
        password,
        firstName,
        lastName
    )
VALUES (
        ${req.email},
        ${req.password},
        ${req.firstname},
        ${req.lastname}
    )`;

    return {
      result,
    };
  },
};
