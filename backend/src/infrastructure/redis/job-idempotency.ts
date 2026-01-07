import { redisClient } from "../../config/redis";

const PREFIX = "job:processed:";

export const isJobProcessed = async (jobId: string) => {
    return redisClient.get(`${PREFIX}${jobId}`);
};

export const markJobProcessed = async (jobId: string) => {
    await redisClient.set(
        `${PREFIX}${jobId}`,
        "1",
        { EX: 60 * 60 * 24 } // 24 hours
    );
};
