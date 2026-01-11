import { PrismaClient } from "./generated/prisma/client/index.js";

export interface IPrismaConfig {
  prisma: PrismaClient;
}