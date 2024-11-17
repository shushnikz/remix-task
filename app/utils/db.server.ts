import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

if (!global.__db) {
  global.__db = new PrismaClient();
}

db = global.__db;

export default db;
