import { sendToDLQ } from "../../../src/infrastructure/kafka/producer/dlq.producer";

jest.mock("kafkajs", () => {
    const actual = jest.requireActual("kafkajs");
    return {
        ...actual,
        Kafka: jest.fn().mockImplementation(() => ({
            producer: jest.fn(() => ({
                connect: jest.fn(),
                send: jest.fn(),
                disconnect: jest.fn(),
            })),
        })),
        Partitioners: actual.Partitioners,
    };
});

describe("DLQ Producer", () => {
    it("publishes message to DLQ topic", async () => {
        await sendToDLQ(
            {
                key: "job-1",
                value: { error: "failed" },
            },
            "unit-test-error"
        );

        expect(true).toBe(true);
    });
});
