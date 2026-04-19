import { prismaService } from "../db/MariaDB";
import bcrypt from "bcrypt";
import {
  type JWT_PAYLOAD,
  type LOGIN_USER_REQUEST,
  type REGISTER_USER_REQUEST,
  REGISTER_SCHEMA,
  type RESET_PASSWORD_REQUEST,
  type UserResponse,
  LOGIN_SCHEMA,
} from "./auth.model";
import { HttpStatus } from "../utils/status_code";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { SECRET } from "../utils/secret";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import type { Context } from "hono";

export const authService = {
  async register(req: REGISTER_USER_REQUEST): Promise<UserResponse> {
    REGISTER_SCHEMA.parse(req);

    const password = await bcrypt.hash(req.password, 12);
    const user = await prismaService.users.create({
      data: {
        email: req.email,
        password: password,
        first_name: req.first_name,
        last_name: req.last_name,
      },
      select: { email: true },
    });

    return {
      email: user.email,
    };
  },
  async login(req: LOGIN_USER_REQUEST, c: Context): Promise<UserResponse> {
    LOGIN_SCHEMA.parse(req);

    if (!SECRET || SECRET === undefined) {
      throw new HTTPException(HttpStatus.UNAUTHORIZED, {
        message: "SECRET NOT FOUND",
      });
    }

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

    const token = await sign(pay, SECRET);
    await setSignedCookie(c, "refresh_token", token, SECRET);

    return {
      email: result.email,
      firstname: result.first_name,
    };
  },
  async me(c: Context): Promise<{ data: JWT_PAYLOAD }> {
    const result = c.get("user");
    return {
      data: result,
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
    const payload = c.get("user");
    const sub: string = payload.sub;
    const npw = await bcrypt.hash(req.password, 12);
    await prismaService.users.update({
      where: { id: sub },
      data: { password: npw },
    });
  },
};
