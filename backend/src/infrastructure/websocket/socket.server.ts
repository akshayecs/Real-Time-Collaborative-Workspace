import { Server } from "socket.io";
import http from "http";
import { verifyAccessToken } from "../../shared/utils/jwt";
import { logger } from "../../config/logger";
import {
    kafkaProducer,
    kafkaConsumer
} from "../../infrastructure/kafka/kafka.client";

const WORKSPACE_TOPIC = "workspace-events";

export const initSocketServer = async (server: http.Server) => {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    // 🔌 Kafka setup
    await kafkaProducer.connect();
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({
        topic: WORKSPACE_TOPIC,
        fromBeginning: false
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

    io.on("connection", (socket) => {
        logger.info(`🔌 Socket connected: ${socket.id}`);

        socket.on("workspace:join", async ({ workspaceId }) => {
            socket.join(workspaceId);

            // Publish event to Kafka
            await kafkaProducer.send({
                topic: WORKSPACE_TOPIC,
                messages: [
                    {
                        key: workspaceId, // 🔑 ensures ordering per workspace
                        value: JSON.stringify({
                            type: "USER_JOINED",
                            workspaceId,
                            userId: socket.data.userId
                        })
                    }
                ]
            });
        });

        socket.on("workspace:leave", async ({ workspaceId }) => {
            socket.leave(workspaceId);

            await kafkaProducer.send({
                topic: WORKSPACE_TOPIC,
                messages: [
                    {
                        key: workspaceId,
                        value: JSON.stringify({
                            type: "USER_LEFT",
                            workspaceId,
                            userId: socket.data.userId
                        })
                    }
                ]
            });
        });

        socket.on("file:change", async ({ workspaceId, payload }) => {
            await kafkaProducer.send({
                topic: WORKSPACE_TOPIC,
                messages: [
                    {
                        key: workspaceId,
                        value: JSON.stringify({
                            type: "FILE_CHANGED",
                            workspaceId,
                            payload,
                            userId: socket.data.userId
                        })
                    }
                ]
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

    // 🔁 Kafka → WebSocket fan-out
    await kafkaConsumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) return;

            const event = JSON.parse(message.value.toString());

            io.to(event.workspaceId).emit(event.type, event);
        }
    });

    return io;
};
