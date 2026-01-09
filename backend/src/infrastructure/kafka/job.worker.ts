import { prisma } from "../db/prisma";
import { logger } from "../../config/logger";
import { JobStatus } from "@prisma/client";
import { ActivityLogger } from "../../application/activity/activity-logger.service";
import { env } from "../../config/env";

const JOB_TOPIC = "job-events";
const DLQ_TOPIC = "job-events-dlq";
const BASE_RETRY_DELAY_MS = 2000;

const activityLogger = new ActivityLogger();

/**
 * Lazy Kafka init for WORKER only
 */
async function getKafkaClients() {
    if (!env.ENABLE_JOBS) {
        throw new Error("Kafka worker started with ENABLE_JOBS=false");
    }

    const { createKafka } = await import("./kafka.client");

    const kafka = createKafka();

    const producer = kafka.producer();
    const consumer = kafka.consumer({ groupId: "job-workers" });

    await producer.connect();
    await consumer.connect();

    return { producer, consumer };
}

const processJob = async (
    jobId: string,
    producer: any
) => {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return;

    // ✅ Idempotency
    if (job.status === JobStatus.SUCCESS) {
        logger.info(`🔁 Job already processed: ${jobId}`);
        return;
    }

    // ❌ Exceeded retries → DLQ
    if (job.retryCount >= job.maxRetries) {
        logger.error(`☠️ Job exceeded retries: ${jobId}`);

        await prisma.job.update({
            where: { id: jobId },
            data: { status: JobStatus.FAILED },
        });

        await producer.send({
            topic: DLQ_TOPIC,
            messages: [{ value: JSON.stringify({ jobId }) }],
        });

        return;
    }

    try {
        // 1️⃣ Mark RUNNING
        await prisma.job.update({
            where: { id: jobId },
            data: {
                status: JobStatus.RUNNING,
                lockedAt: new Date(),
            },
        });

        // 🔧 Simulated work
        await new Promise((r) => setTimeout(r, 3000));

        // 2️⃣ SUCCESS
        await prisma.job.update({
            where: { id: jobId },
            data: {
                status: JobStatus.SUCCESS,
                result: { message: "Completed" },
            },
        });

        await activityLogger.log("SYSTEM", "JOB_SUCCESS", { jobId });

        logger.info(`✅ Job completed: ${jobId}`);
    } catch (err: any) {
        logger.error(err);

        const retryCount = job.retryCount + 1;
        const delay = BASE_RETRY_DELAY_MS * Math.pow(2, retryCount);

        await prisma.job.update({
            where: { id: jobId },
            data: {
                retryCount,
                status: JobStatus.PENDING,
            },
        });

        await activityLogger.log("SYSTEM", "JOB_RETRY", {
            jobId,
            retryCount,
        });

        logger.warn(`🔁 Retrying job ${jobId} in ${delay}ms`);

        setTimeout(async () => {
            await producer.send({
                topic: JOB_TOPIC,
                messages: [{ value: JSON.stringify({ jobId }) }],
            });
        }, delay);
    }
};

export const startJobWorker = async () => {
    const { producer, consumer } = await getKafkaClients();

    await consumer.subscribe({
        topic: JOB_TOPIC,
        fromBeginning: false,
    });

    logger.info("🧵 Kafka Job Worker started");

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) return;

            const { jobId } = JSON.parse(message.value.toString());
            await processJob(jobId, producer);
        },
    });
};
