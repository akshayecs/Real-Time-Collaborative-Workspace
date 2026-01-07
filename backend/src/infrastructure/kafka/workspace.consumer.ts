import { EachMessagePayload } from "kafkajs";
import { kafkaConsumer } from "./kafka.client";

import { Server } from "socket.io";
import { ActivityLogger } from "../../application/activity/activity-logger.service";

const activityLogger = new ActivityLogger();

export const startWorkspaceConsumer = async (io: Server) => {
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({
        topic: "workspace-events",
        fromBeginning: false
    });

    await kafkaConsumer.run({
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
        }
    });
};
