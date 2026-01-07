import { Kafka } from "kafkajs";
import { env } from "../../config/env";
export const kafka = new Kafka({
    clientId: "realtime-collab-backend",
    brokers: [env.KAFKA_BROKER]
});

export const kafkaProducer = kafka.producer();

export const kafkaConsumer = kafka.consumer({
    groupId: "socket-consumer-group"
});
