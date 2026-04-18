import { prismaService } from "../db/MariaDB";
import bcrypt from "bcrypt";
import {
  type JWT_PAYLOAD,
  type LOGIN_USER_REQUEST,
  type REGISTER_USER_REQUEST,
  type RESET_PASSWORD_REQUEST,
  type UserResponse,
} from "./auth.model";
import { HttpStatus } from "../utils/status_code";
import { HTTPException } from "hono/http-exception";
import { sign, decode, verify } from "hono/jwt";
import { SECRET } from "../utils/secret";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import type { Context } from "hono";
import { winstonlogger } from "../utils/winston-logger";

export const authService = {
  async register(req: REGISTER_USER_REQUEST): Promise<UserResponse> {
    const validate = await prismaService.users.findUnique({
      where: { email: req.email },
    });

    if (validate?.email === req.email) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "user already registered",
      });
    }

    const password = await bcrypt.hash(req.password, 12);

    await prismaService.users.create({
      data: {
        email: req.email,
        password: password,
        first_name: req.first_name,
        last_name: req.last_name,
      },
    });

    const user = await prismaService.users.findUnique({
      where: { email: req.email },
    });

    if (user?.email === undefined || !user) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "User not created",
      });
    }

    return {
      email: user.email,
    };
  },
  async login(req: LOGIN_USER_REQUEST, c: Context): Promise<UserResponse> {
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
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      iat: Math.floor(Date.now() / 1000),
    };
    winstonlogger.debug(pay);

    if (!SECRET || SECRET === undefined) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "SECRET NOT FOUND",
      });
    }

    const token = await sign(pay, SECRET);
    await setSignedCookie(c, "refresh_token", token, SECRET);

    return {
      email: result.email,
      firstname: result.first_name,
    };
  },
  async logout(c: Context): Promise<void> {
    const cookie = await getSignedCookie(c, SECRET, "refresh_token");
    if (!cookie) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Cookie Already Cleared",
      });
    }
    deleteCookie(c, "refresh_token");
  },
  async reset_password(req: RESET_PASSWORD_REQUEST, c: Context): Promise<void> {
    if (!SECRET || SECRET === undefined) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "SECRET NOT FOUND",
      });
    }
    const get_token = await getSignedCookie(c, SECRET, "refresh_token");
    if (!get_token) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }
    let payload: JWT_PAYLOAD;
    try {
      payload = await verify(get_token, SECRET, "HS256");
    } catch (err) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "Invalid or expired token",
      });
    }
    const sub = payload.sub as string;
    const npw = await bcrypt.hash(req.password, 12);
    await prismaService.users.update({
      where: { id: sub },
      data: { password: npw },
    });
  },
};
