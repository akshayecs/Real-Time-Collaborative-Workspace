import { redisClient } from "./redis.client";

const JOB_TTL = 60 * 60; // 1 hour

export async function isJobProcessed(jobId: string): Promise<boolean> {
    return (await redisClient.exists(`job:${jobId}`)) === 1;
}

export async function markJobProcessed(jobId: string) {
    await redisClient.set(`job:${jobId}`, "done", "EX", JOB_TTL);
}
