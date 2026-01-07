import { kafka } from "./kafka.client";
import { KAFKA_TOPICS } from "./topics";
import { JobConsumer } from "./consumer/job.consumer";

export const startKafkaConsumers = async () => {
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
                // Retry is handled inside BaseKafkaConsumer
                throw err;
            }
        },
    });

    console.log("✅ Kafka Job Consumer started");
};
