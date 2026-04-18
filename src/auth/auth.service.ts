import { prismaService } from "../db/MariaDB";
import bcrypt from "bcrypt";
import {
  type JWT_PAYLOAD,
  type LOGIN_USER_REQUEST,
  type REGISTER_USER_REQUEST,
  UserResponse,
} from "./auth.model";
import { HttpStatus } from "../utils/status_code";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { SECRET } from "../utils/secret";
import {
  deleteCookie,
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  generateCookie,
  generateSignedCookie,
} from "hono/cookie";

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

    const match = await bcrypt.compare(req.password, result.password);

    if (match === false || !match) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }

    const pay: JWT_PAYLOAD = {
      sub: result.id,
      email: result.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 5,
    };

    if (!SECRET || SECRET === undefined) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "SECRET NOT FOUND",
      });
    }

    await sign(pay, SECRET);

    return {
      email: result.email,
      firstname: result.first_name,
    };
  },
  // clear cookie / jwt
  async logout() {},
};
