import { prismaService } from "../db/MariaDB";
import bcrypt from "bcrypt";
import {
  type LOGIN_USER_REQUEST,
  type REGISTER_USER_REQUEST,
  UserResponse,
  UserResponseQuery,
} from "./auth.model";
import { HttpStatus } from "../utils/status_code";
import { HTTPException } from "hono/http-exception";

export const authService = {
  async register(req: REGISTER_USER_REQUEST): Promise<UserResponse> {
    const password = await bcrypt.hash(req.password, 12);
    await prismaService.$executeRaw`
    insert into users (
        email,
        password,
        first_name,
        last_name
    ) VALUES (
        ${req.email},
        ${password},
        ${req.firstname},
        ${req.lastname}
    )`;

    const user = await prismaService.users.findUnique({
      where: { email: req.email },
    });

    if (user === undefined || !user) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "User not found",
      });
    }

    return {
      email: user.email,
    };
  },
  async login(req: LOGIN_USER_REQUEST): Promise<UserResponse> {
    const result = await prismaService.users.findUnique({
      where: { email: req.email },
    });

    if (result === undefined || !result) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }

    return {
      email: result.email,
      firstname: result.first_name,
    };
  },
};
