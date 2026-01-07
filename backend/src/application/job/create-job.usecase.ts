import { prisma } from "../../infrastructure/db/prisma";
import { kafkaProducer } from "../../infrastructure/kafka/kafka.client";
import { JobType } from "../../domain/job/job.types";

const JOB_TOPIC = "job-events";

export class CreateJobUseCase {
    async execute(
        type: JobType,
        payload: Record<string, any>,
        idempotencyKey: string
    ) {
        // Idempotency
        const existing = await prisma.job.findUnique({
            where: { idempotencyKey }
        });
        if (existing) return existing;

        const job = await prisma.job.create({
            data: { type, payload, idempotencyKey }
        });

        await kafkaProducer.connect();
        await kafkaProducer.send({
            topic: JOB_TOPIC,
            messages: [
                {
                    key: job.id, // ordering per job
                    value: JSON.stringify({ jobId: job.id })
                }
            ]
        });

        return job;
    }
}
