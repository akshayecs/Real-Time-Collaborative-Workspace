// import { Request, Response } from "express";
// import { kafkaProducer } from "../../../infrastructure/kafka/kafka.client";
// import { logger } from "../../../config/logger";
// import crypto from "crypto";
// import { JobType } from "@prisma/client";
// import { prisma } from "../../../infrastructure/db/prisma";
// const JOB_TOPIC = "job-events";

// export const emitJob = async (req: Request, res: Response) => {
//     try {
//         const { type, payload } = req.body;
//         const userId = (req as any).user!.id;

//         if (!type || !payload) {
//             return res.status(400).json({
//                 message: "type and payload are required"
//             });
//         }

//         const existingJob = await prisma.job.findFirst({
//             where: {
//                 type: JobType.AUDIT_LOG,
//                 payload: {
//                     equals: { message: "Hello" }
//                 }
//             }
//         });

//         if (existingJob) {
//             return res.status(202).json({
//                 message: "Job already exists",
//                 jobId: existingJob.id,
//                 status: existingJob.status
//             });
//         }

//         const rawIdempotencyKey = req.headers["idempotency-key"];

//         const idempotencyKey =
//             Array.isArray(rawIdempotencyKey)
//                 ? rawIdempotencyKey[0]
//                 : rawIdempotencyKey ?? crypto.randomUUID();

//         const job = await prisma.job.create({
//             data: {
//                 type: JobType.AUDIT_LOG,
//                 payload,
//                 status: "PENDING",
//                 retryCount: 0,
//                 maxRetries: 3,
//                 idempotencyKey
//             }
//         });

//         await kafkaProducer.send({
//             topic: JOB_TOPIC,
//             messages: [
//                 {
//                     key: job.id,
//                     value: JSON.stringify({
//                         jobId: job.id,
//                         type: job.type
//                     })
//                 }
//             ]
//         });

//         logger.info(`📨 Job emitted: ${job.id}`);

//         return res.status(202).json({
//             message: "Job queued successfully",
//             jobId: job.id,
//             status: job.status
//         });

//     } catch (error: any) {
//         logger.error(error);
//         return res.status(500).json({
//             message: "Failed to emit job",
//             error: error.message
//         });
//     }
// };

import { Request, Response } from "express";
import { logger } from "../../../config/logger";
import crypto from "crypto";
import { JobType } from "@prisma/client";
import { prisma } from "../../../infrastructure/db/prisma";
import { env } from "../../../config/env";

const JOB_TOPIC = "job-events";

let producer: any = null;

/**
 * Lazy Kafka producer initializer
 * - Kafka is only created if ENABLE_JOBS=true
 * - Safe for main API service
 */
async function getKafkaProducer() {
    if (!env.ENABLE_JOBS) {
        return null;
    }

    if (producer) {
        return producer;
    }

    const { createKafka } = await import(
        "../../../infrastructure/kafka/kafka.client"
    );

    const kafka = createKafka();
    producer = kafka.producer();
    await producer.connect();

    return producer;
}

export const emitJob = async (req: Request, res: Response) => {
    try {
        const { type, payload } = req.body;
        const userId = (req as any).user?.id ?? "SYSTEM";

        if (!type || !payload) {
            return res.status(400).json({
                message: "type and payload are required",
            });
        }

        // ✅ Idempotency
        const rawIdempotencyKey = req.headers["idempotency-key"];
        const idempotencyKey =
            Array.isArray(rawIdempotencyKey)
                ? rawIdempotencyKey[0]
                : rawIdempotencyKey ?? crypto.randomUUID();

        const existingJob = await prisma.job.findFirst({
            where: { idempotencyKey },
        });

        if (existingJob) {
            return res.status(202).json({
                message: "Job already exists",
                jobId: existingJob.id,
                status: existingJob.status,
            });
        }

        const job = await prisma.job.create({
            data: {
                type: JobType.AUDIT_LOG,
                payload,
                status: "PENDING",
                retryCount: 0,
                maxRetries: 3,
                idempotencyKey,
            },
        });

        // ✅ Kafka is OPTIONAL
        const kafkaProducer = await getKafkaProducer();

        if (kafkaProducer) {
            await kafkaProducer.send({
                topic: JOB_TOPIC,
                messages: [
                    {
                        key: job.id,
                        value: JSON.stringify({
                            jobId: job.id,
                            type: job.type,
                            userId,
                        }),
                    },
                ],
            });

            logger.info(`📨 Job emitted to Kafka: ${job.id}`);
        } else {
            logger.info(
                `🚫 Kafka disabled — job stored only in DB: ${job.id}`
            );
        }

        return res.status(202).json({
            message: "Job queued successfully",
            jobId: job.id,
            status: job.status,
        });
    } catch (error: any) {
        logger.error(error);
        return res.status(500).json({
            message: "Failed to emit job",
            error: error.message,
        });
    }
};
