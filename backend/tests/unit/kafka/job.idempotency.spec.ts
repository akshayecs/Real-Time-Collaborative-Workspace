
jest.mock(
    "../../../src/infrastructure/kafka/start.kafka",
    () => ({
        startKafkaConsumers: jest.fn(),
    })
);

jest.mock(
    "../../../src/infrastructure/redis/redis.client",
    () => ({
        redisClient: {
            get: jest.fn(),
            set: jest.fn(),
            expire: jest.fn(),
        },
    })
);

import { redisClient } from "../../../src/infrastructure/redis/redis.client";
import { IdempotencyService } from "../../../src/infrastructure/kafka/idempotency/idempotency.service";

describe("Kafka Job Idempotency", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns true if job already processed", async () => {
        (redisClient.get as jest.Mock).mockResolvedValue("processed");

        const result = await IdempotencyService.hasProcessed("job-1");

        expect(result).toBe(true);
        expect(redisClient.get).toHaveBeenCalledWith("job-1");
    });

    it("marks job as processed", async () => {
        await IdempotencyService.markProcessed("job-2");

        expect(redisClient.set).toHaveBeenCalledWith("job-2", "processed");
        expect(redisClient.expire).toHaveBeenCalledWith("job-2", 3600);
    });
});
