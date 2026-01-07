import { redisClient } from "../../../infrastructure/redis/redis.client";

export class IdempotencyService {
    static async hasProcessed(key: string): Promise<boolean> {
        const exists = await redisClient.get(key);
        return !!exists;
    }

    static async markProcessed(key: string): Promise<void> {
        await redisClient.set(key, "processed");
        await redisClient.expire(key, 3600); // 1 hour (60 * 60)
    }
}
