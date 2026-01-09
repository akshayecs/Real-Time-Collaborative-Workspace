import crypto from "crypto";
import { getKafkaProducer } from "../../infrastructure/kafka/kafka.producer";
import { JobType, KafkaJob } from "../../shared/types/job.types";

const JOB_TOPIC = "job-events";

export async function emitJob<T extends JobType>(
    type: T,
    payload: any
) {
    const job: KafkaJob = {
        id: crypto.randomUUID(),
        type,
        payload,
        idempotencyKey: crypto.randomUUID(),
        retryCount: 0,
        maxRetries: 3,
    };

    // ✅ Kafka is OPTIONAL & lazy
    const producer = await getKafkaProducer();

    if (!producer) {
        // Kafka disabled → just return job object
        return job;
    }

    await producer.send({
        topic: JOB_TOPIC,
        messages: [
            {
                key: job.id,
                value: JSON.stringify(job),
            },
        ],
    });

    return job;
}
