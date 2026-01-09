import { EachMessagePayload } from "kafkajs";
import { Server } from "socket.io";
import { ActivityLogger } from "../../application/activity/activity-logger.service";
import { env } from "../../config/env";

const activityLogger = new ActivityLogger();
const WORKSPACE_TOPIC = "workspace-events";

/**
 * Workspace Kafka consumer (API service)
 * - Lazy Kafka init
 * - Safe when Kafka is disabled
 * - Broadcasts events via WebSocket
 */
export const startWorkspaceConsumer = async (io: Server) => {
    if (!env.ENABLE_JOBS) {
        console.log("🚫 Workspace Kafka consumer disabled");
        return;
    }

    const { createKafka } = await import("./kafka.client");

    const kafka = createKafka();

    const consumer = kafka.consumer({
        groupId: "workspace-consumer-group",
    });

    await consumer.connect();

    await consumer.subscribe({
        topic: WORKSPACE_TOPIC,
        fromBeginning: false,
    });

    await consumer.run({
        eachMessage: async ({ message }: EachMessagePayload) => {
            if (!message.value) return;

            const event = JSON.parse(message.value.toString());

            // 🔁 WebSocket broadcast
            io.to(event.workspaceId).emit(event.type, event);

            // 📝 Activity log
            await activityLogger.log(
                event.workspaceId,
                event.type,
                event.payload,
                event.userId
            );
        },
    });

    console.log("🧩 Workspace Kafka consumer started");
};
