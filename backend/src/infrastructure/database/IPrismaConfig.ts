import { PrismaClient } from "./generated/prisma/client.js";

export interface IPrismaConfig {
  prisma: PrismaClient;
}