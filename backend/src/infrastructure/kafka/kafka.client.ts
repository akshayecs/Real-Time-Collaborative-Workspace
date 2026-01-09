import { Kafka } from "kafkajs";
import { env } from "../../config/env";

if (!env.ENABLE_JOBS || !env.KAFKA_BROKER) {
    throw new Error("Kafka is disabled");
}

export const kafka = new Kafka({
    clientId: "collab-backend",
    brokers: [env.KAFKA_BROKER],
});

export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({
    groupId: "job-workers",
});
