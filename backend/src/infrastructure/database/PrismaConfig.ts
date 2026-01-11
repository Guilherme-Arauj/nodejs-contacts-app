import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "./generated/prisma/client/index.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

class PrismaConfig {
  public prisma: PrismaClient;

  constructor() {
    const dbUrl = process.env.DATABASE_URL;
  
    if (!dbUrl) {
      throw new Error("DATABASE_URL não encontrada no .env");
    }

    const url = new URL(dbUrl);

    const adapter = new PrismaMariaDb({
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      connectionLimit: 5
    });

    this.prisma = new PrismaClient({ adapter });
  }
}

export const prismaConfig = new PrismaConfig();
export const prisma = prismaConfig.prisma;