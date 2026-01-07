import { kafka } from "../kafka.client";
import { KAFKA_TOPICS } from "../topics";

const producer = kafka.producer();

export const sendToDLQ = async (message: any, reason: string) => {
    await producer.connect();

    await producer.send({
        topic: KAFKA_TOPICS.JOBS_DLQ,
        messages: [
            {
                value: JSON.stringify({
                    message,
                    reason,
                    failedAt: new Date().toISOString(),
                }),
            },
        ],
    });
};
