import { env } from "../../config/env";

let producer: any = null;

export async function getKafkaProducer() {
    if (!env.ENABLE_JOBS) {
        return null;
    }

    if (producer) {
        return producer;
    }

    const { createKafka } = await import("./kafka.client");

    const kafka = createKafka();
    producer = kafka.producer();

    await producer.connect();

    return producer;
}
