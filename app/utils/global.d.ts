import { PrismaClient } from "@prisma/client";

declare global {
  var __db: PrismaClient | undefined; // Declare __db as an optional PrismaClient
}

export {};
