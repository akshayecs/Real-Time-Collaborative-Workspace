import { prisma } from "../../infrastructure/db/prisma";
import { JobType } from "../../domain/job/job.types";
import { getKafkaProducer } from "../../infrastructure/kafka/kafka.producer";

const JOB_TOPIC = "job-events";

export class CreateJobUseCase {
    async execute(
        type: JobType,
        payload: Record<string, any>,
        idempotencyKey: string
    ) {
        // ✅ Idempotency
        const existing = await prisma.job.findUnique({
            where: { idempotencyKey },
        });
        if (existing) return existing;

        const job = await prisma.job.create({
            data: {
                type,
                payload,
                idempotencyKey,
                status: "PENDING",
                retryCount: 0,
                maxRetries: 3,
            },
        });

        // ✅ Kafka is OPTIONAL
        const producer = await getKafkaProducer();

        if (producer) {
            await producer.send({
                topic: JOB_TOPIC,
                messages: [
                    {
                        key: job.id,
                        value: JSON.stringify({ jobId: job.id }),
                    },
                ],
            });
        }

        return job;
    }
}
