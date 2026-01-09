import express, {
    Request,
    Response,
    NextFunction,
    ErrorRequestHandler,
} from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { apiRateLimiter } from "./config/rateLimiter";
import authRoutes from "./interfaces/http/routes/auth.routes";
import projectRoutes from "./interfaces/http/routes/project.routes";
import workspaceRoutes from "./interfaces/http/routes/workspace.routes";
import activityRoutes from "./interfaces/http/routes/activity.routes";
import { swaggerSpec } from "./infrastructure/swagger/swagger.config";
import jobRoutes from "./interfaces/http/routes/jobs.routes";
import { startKafkaConsumers } from "./infrastructure/kafka/start.kafka";

const authErrorHandler: ErrorRequestHandler = (
    err,
    _req,
    res,
    _next
) => {
    res.status(401).json({
        error: err.message,
    });
};
export const createApp = async () => {
    const app = express();

    app.use(helmet());

    app.use(
        cors({
            origin: process.env.CORS_ORIGIN?.split(",") || "*",
            credentials: true,
        })
    );

    app.use(express.json());

    // ✅ Swagger BEFORE rate limiting
    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, { explorer: true })
    );

    app.use(apiRateLimiter);

    // Routes
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/projects", projectRoutes);
    app.use("/api/v1/workspaces", workspaceRoutes);
    app.use("/api/v1/activity", activityRoutes);
    app.use("/api/v1/jobs", jobRoutes);

    // Health check
    app.get("/health", (_req, res) => {
        res.status(200).json({ status: "ok" });
    });

    app.use(authErrorHandler);

    // global fallback error handler (500)
    app.use((err: any, _req: any, res: any, _next: any) => {
        console.error(err);
        res.status(err.status || 500).json({
            success: false,
            message: err.message || "Internal Server Error",
        });
    });

    // try {
    //     await startKafkaConsumers();
    // } catch (err) {
    //     console.error("❌ Kafka startup failed", err);
    // }

    return app;
};

