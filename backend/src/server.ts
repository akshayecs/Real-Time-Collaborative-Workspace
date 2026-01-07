import dotenv from "dotenv";
dotenv.config();

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./infrastructure/swagger/swagger.config";

import http from "http";
import { createApp } from "./app";
import { connectPrisma } from "./infrastructure/db/prisma";
import { connectRedis } from "./config/redis";
import { initSocketServer } from "./infrastructure/websocket/socket.server";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { connectMongo } from "./infrastructure/mongo/mongo.client";

const PORT = env.PORT || 4000;
const startServer = async () => {
    await connectMongo();
    await connectPrisma();
    await connectRedis();

    const app = await createApp();
    const server = http.createServer(app);

    await initSocketServer(server);
    app.listen(PORT, "0.0.0.0", () => {
        logger.info(`🚀 Server running on port ${env.PORT}`);
    });
};

startServer();
