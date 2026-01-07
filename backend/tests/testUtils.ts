// tests/testUtils.ts
import { createApp } from "../src/app";
import { prisma } from "../src/infrastructure/db/prisma";

process.env.NODE_ENV = "test";

export const setupApp = async () => {
    return await createApp();
};

afterAll(async () => {
    await prisma.$disconnect();
});
