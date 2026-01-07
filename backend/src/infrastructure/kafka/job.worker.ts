import { kafkaConsumer, kafkaProducer } from "./kafka.client";
import { prisma } from "../db/prisma";
import { logger } from "../../config/logger";
import { JobStatus } from "@prisma/client";
import { ActivityLogger } from "../../application/activity/activity-logger.service";

const JOB_TOPIC = "job-events";
const DLQ_TOPIC = "job-events-dlq";
const activityLogger = new ActivityLogger();

const BASE_RETRY_DELAY_MS = 2000;

const processJob = async (jobId: string) => {
    // 1️⃣ Fetch job with lock check
    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) return;

    // ✅ Idempotency
    if (job.status === JobStatus.SUCCESS) {
        logger.info(`🔁 Job already processed: ${jobId}`);
        return;
    }

    if (job.retryCount >= job.maxRetries) {
        logger.error(`☠️ Job exceeded retries: ${jobId}`);

        await prisma.job.update({
            where: { id: jobId },
            data: { status: JobStatus.FAILED }
        });

        await kafkaProducer.send({
            topic: DLQ_TOPIC,
            messages: [{ value: JSON.stringify({ jobId }) }]
        });

        return;
    }

    try {
        // 2️⃣ Mark RUNNING
        await prisma.job.update({
            where: { id: jobId },
            data: {
                status: JobStatus.RUNNING,
                lockedAt: new Date()
            }
        });

        // 🔧 Simulated heavy work
        await new Promise((r) => setTimeout(r, 3000));

        // 3️⃣ SUCCESS
        await prisma.job.update({
            where: { id: jobId },
            data: {
                status: JobStatus.SUCCESS,
                result: { message: "Completed" }
            }
        });

        await activityLogger.log("SYSTEM", "JOB_SUCCESS", { jobId });

        logger.info(`✅ Job completed: ${jobId}`);

    } catch (err: any) {
        logger.error(err);

        const retryCount = job.retryCount + 1;
        const delay = BASE_RETRY_DELAY_MS * Math.pow(2, retryCount);

        // 4️⃣ Increment retry count
        await prisma.job.update({
            where: { id: jobId },
            data: {
                retryCount,
                status: JobStatus.PENDING
            }
        });

        await activityLogger.log("SYSTEM", "JOB_RETRY", {
            jobId,
            retryCount
        });

        logger.warn(`🔁 Retrying job ${jobId} in ${delay}ms`);

        setTimeout(async () => {
            await kafkaProducer.send({
                topic: JOB_TOPIC,
                messages: [{ value: JSON.stringify({ jobId }) }]
            });
        }, delay);
    }
};

export const startJobWorker = async () => {
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({
        topic: JOB_TOPIC,
        fromBeginning: false
    });

    logger.info("🧵 Kafka Job Worker started");

    await kafkaConsumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) return;
            const { jobId } = JSON.parse(message.value.toString());
            await processJob(jobId);
        }
    });
};

startJobWorker();
