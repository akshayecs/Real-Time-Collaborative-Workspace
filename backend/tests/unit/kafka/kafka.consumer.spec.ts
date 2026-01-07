jest.mock("kafkajs", () => {
    return {
        Kafka: jest.fn().mockImplementation(() => ({
            consumer: jest.fn(() => ({
                connect: jest.fn(),
                subscribe: jest.fn(),
                run: jest.fn(({ eachMessage }) =>
                    eachMessage({
                        message: {
                            key: Buffer.from("job-1"),
                            value: Buffer.from(JSON.stringify({ task: "run" })),
                        },
                    })
                ),
            })),
        })),
    };
});

jest.mock("../../../src/infrastructure/kafka/retry/retry.strategy", () => ({
    shouldRetry: jest.fn(() => true),
}));

jest.mock("../../../src/infrastructure/kafka/idempotency/idempotency.service", () => ({
    IdempotencyService: {
        isProcessed: jest.fn(() => false),
        markProcessed: jest.fn(),
    },
}));

import { JobConsumer } from "../../../src/infrastructure/kafka/consumer/job.consumer";

describe("JobConsumer", () => {
    let consumer: JobConsumer;

    beforeEach(() => {
        consumer = new JobConsumer();
    });

    it("processes valid job payload", async () => {
        const message = {
            payload: { jobId: "job-1" },
        };

        await expect(consumer.handle(message)).resolves.not.toThrow();
    });

    it("throws error for invalid payload", async () => {
        const message = {
            payload: null,
        };

        await expect(consumer.handle(message)).rejects.toThrow(
            "Invalid job payload"
        );
    });
});
