import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: Bun.env["DATABASE_HOST"] as string,
  user: Bun.env["DATABASE_USER"] as string,
  password: Bun.env["DATABASE_PASSWORD"] as string,
  database: Bun.env["DATABASE_NAME"] as string,
  connectionLimit: 5,
});

export const prismaService = new PrismaClient({ adapter });
