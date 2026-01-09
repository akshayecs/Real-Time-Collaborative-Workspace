import { Kafka } from "kafkajs";
import { env } from "../../config/env";

export function createKafka() {
    if (!env.KAFKA_BROKER) {
        throw new Error("Kafka broker not configured");
    }

    return new Kafka({
        clientId: process.env.KAFKA_CLIENT_ID || "collab-backend",
        brokers: [env.KAFKA_BROKER],
        ssl: true,
        sasl: {
            mechanism: "plain",
            username: process.env.KAFKA_SASL_USERNAME!,
            password: process.env.KAFKA_SASL_PASSWORD!,
        },
    });
}
