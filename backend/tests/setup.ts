process.env.KAFKAJS_NO_PARTITIONER_WARNING = "1";
process.env.NODE_ENV = "test";

import supertest from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app";
import { prisma } from "../src/infrastructure/db/prisma";

let app: Express;
let request: ReturnType<typeof supertest>;

beforeAll(async () => {
    app = await createApp();
    request = supertest(app);
});

afterAll(async () => {
    await prisma.$disconnect();
});

export { app, request };
