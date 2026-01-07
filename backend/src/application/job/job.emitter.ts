import { kafkaProducer } from "../../infrastructure/kafka/kafka.client";
import { JobType, KafkaJob } from "../../shared/types/job.types";
import { v4 as uuid } from "uuid";

export async function emitJob<T extends JobType>(
    type: T,
    payload: any
) {
    const job: KafkaJob = {
        id: crypto.randomUUID(),
        type: JobType.DOCUMENT_SYNC,
        payload,
        idempotencyKey: crypto.randomUUID(),
        retryCount: 0,
        maxRetries: 3,
    };

    await kafkaProducer.send({
        topic: "jobs",
        messages: [
            {
                key: job.id,
                value: JSON.stringify(job),
            },
        ],
    });
}
