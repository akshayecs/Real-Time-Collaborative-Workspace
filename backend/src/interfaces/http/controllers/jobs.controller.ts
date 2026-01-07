import { Request, Response } from "express";
import { kafkaProducer } from "../../../infrastructure/kafka/kafka.client";
import { logger } from "../../../config/logger";
import crypto from "crypto";
import { JobType } from "@prisma/client";
import { prisma } from "../../../infrastructure/db/prisma";
const JOB_TOPIC = "job-events";

export const emitJob = async (req: Request, res: Response) => {
    try {
        const { type, payload } = req.body;
        const userId = (req as any).user!.id;

        if (!type || !payload) {
            return res.status(400).json({
                message: "type and payload are required"
            });
        }

        const existingJob = await prisma.job.findFirst({
            where: {
                type: JobType.AUDIT_LOG,
                payload: {
                    equals: { message: "Hello" }
                }
            }
        });

        if (existingJob) {
            return res.status(202).json({
                message: "Job already exists",
                jobId: existingJob.id,
                status: existingJob.status
            });
        }

        const rawIdempotencyKey = req.headers["idempotency-key"];

        const idempotencyKey =
            Array.isArray(rawIdempotencyKey)
                ? rawIdempotencyKey[0]
                : rawIdempotencyKey ?? crypto.randomUUID();

        const job = await prisma.job.create({
            data: {
                type: JobType.AUDIT_LOG,
                payload,
                status: "PENDING",
                retryCount: 0,
                maxRetries: 3,
                idempotencyKey
            }
        });

        await kafkaProducer.send({
            topic: JOB_TOPIC,
            messages: [
                {
                    key: job.id,
                    value: JSON.stringify({
                        jobId: job.id,
                        type: job.type
                    })
                }
            ]
        });

        logger.info(`📨 Job emitted: ${job.id}`);

        return res.status(202).json({
            message: "Job queued successfully",
            jobId: job.id,
            status: job.status
        });

    } catch (error: any) {
        logger.error(error);
        return res.status(500).json({
            message: "Failed to emit job",
            error: error.message
        });
    }
};
