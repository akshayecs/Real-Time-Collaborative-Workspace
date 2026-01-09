import { Kafka } from "kafkajs";
import { env } from "../../config/env";

if (!env.ENABLE_JOBS || !env.KAFKA_BROKER) {
    throw new Error("Kafka is disabled");
}

export const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || "collab-backend",
    brokers: [env.KAFKA_BROKER],
    ssl: true,
    sasl: {
        mechanism: "plain",
        username: process.env.KAFKA_SASL_USERNAME!,
        password: process.env.KAFKA_SASL_PASSWORD!,
    },
});

export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({
    groupId: "job-workers",
});
