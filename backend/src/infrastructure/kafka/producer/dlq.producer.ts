import { getKafkaProducer } from "../kafka.producer";
import { KAFKA_TOPICS } from "../topics";

/**
 * Send a message to Dead Letter Queue (DLQ)
 * Kafka-safe, lazy, optional
 */
export const sendToDLQ = async (
    message: any,
    reason: string
) => {
    const producer = await getKafkaProducer();

    if (!producer) {
        // Kafka disabled → nothing to do
        return;
    }

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
