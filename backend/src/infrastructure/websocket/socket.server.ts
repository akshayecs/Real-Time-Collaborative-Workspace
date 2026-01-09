import { Server } from "socket.io";
import http from "http";
import { verifyAccessToken } from "../../shared/utils/jwt";
import { logger } from "../../config/logger";
import { env } from "../../config/env";

const WORKSPACE_TOPIC = "workspace-events";

/**
 * Initialize WebSocket server
 * Kafka is OPTIONAL and lazy-loaded
 */
export const initSocketServer = async (server: http.Server) => {
    const io = new Server(server, {
        cors: { origin: "*" },
    });

    // 🔐 Socket authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("Unauthorized"));

        try {
            const payload = verifyAccessToken(token);
            socket.data.userId = payload.userId;
            next();
        } catch {
            next(new Error("Invalid token"));
        }
    });

    /**
     * Lazy Kafka producer (shared for sockets)
     */
    let producer: any = null;

    async function getProducer() {
        if (!env.ENABLE_JOBS) return null;

        if (producer) return producer;

        const { createKafka } = await import(
            "../../infrastructure/kafka/kafka.client"
        );

        const kafka = createKafka();
        producer = kafka.producer();
        await producer.connect();

        return producer;
    }

    io.on("connection", (socket) => {
        logger.info(`🔌 Socket connected: ${socket.id}`);

        socket.on("workspace:join", async ({ workspaceId }) => {
            socket.join(workspaceId);

            const producer = await getProducer();
            if (!producer) return;

            await producer.send({
                topic: WORKSPACE_TOPIC,
                messages: [
                    {
                        key: workspaceId,
                        value: JSON.stringify({
                            type: "USER_JOINED",
                            workspaceId,
                            userId: socket.data.userId,
                        }),
                    },
                ],
            });
        });

        socket.on("workspace:leave", async ({ workspaceId }) => {
            socket.leave(workspaceId);

            const producer = await getProducer();
            if (!producer) return;

            await producer.send({
                topic: WORKSPACE_TOPIC,
                messages: [
                    {
                        key: workspaceId,
                        value: JSON.stringify({
                            type: "USER_LEFT",
                            workspaceId,
                            userId: socket.data.userId,
                        }),
                    },
                ],
            });
        });

        socket.on("file:change", async ({ workspaceId, payload }) => {
            const producer = await getProducer();
            if (!producer) return;

            await producer.send({
                topic: WORKSPACE_TOPIC,
                messages: [
                    {
                        key: workspaceId,
                        value: JSON.stringify({
                            type: "FILE_CHANGED",
                            workspaceId,
                            payload,
                            userId: socket.data.userId,
                        }),
                    },
                ],
            });
        });

        socket.on("editor:update", (payload) => {
            socket.to(payload.projectId).emit("editor:update", {
                content: payload.content,
                updatedBy: socket.data.userId,
            });
        });

        socket.on("disconnect", () => {
            logger.info(`❌ Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};
