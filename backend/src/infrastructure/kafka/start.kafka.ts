import { env } from "../../config/env";
import { KAFKA_TOPICS } from "./topics";
import { JobConsumer } from "./consumer/job.consumer";

/**
 * Start Kafka consumers (WORKER ONLY)
 * Safe, lazy, production-ready
 */
export const startKafkaConsumers = async () => {
    if (!env.ENABLE_JOBS) {
        console.log("🚫 Kafka consumers disabled");
        return;
    }

    const { createKafka } = await import("./kafka.client");

    const kafka = createKafka();

    const consumer = kafka.consumer({
        groupId: "job-consumer-group",
    });

    await consumer.connect();

    await consumer.subscribe({
        topic: KAFKA_TOPICS.JOBS,
        fromBeginning: false,
    });

    const jobConsumer = new JobConsumer();

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) return;

            const payload = JSON.parse(message.value.toString());

            try {
                await jobConsumer.process(payload);
            } catch (err) {
                // Let KafkaJS handle retries / crashes
                throw err;
            }
        },
    });

    console.log("✅ Kafka Job Consumer started");
};
