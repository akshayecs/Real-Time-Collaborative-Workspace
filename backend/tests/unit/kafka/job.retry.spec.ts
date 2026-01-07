import { retryWithBackoff } from "../../../src/infrastructure/kafka/retry/retryWithBackoffs";

describe("Kafka Retry with Backoff", () => {
    it("retries failed job and succeeds", async () => {
        const fn = jest
            .fn()
            .mockRejectedValueOnce(new Error("fail"))
            .mockResolvedValue(true);

        const result = await retryWithBackoff(fn);

        expect(fn).toHaveBeenCalledTimes(2);
        expect(result).toBe(true);
    });

    it("retries function on failure", async () => {
        const fn = jest
            .fn()
            .mockRejectedValueOnce(new Error("fail"))
            .mockResolvedValueOnce(undefined);

        await retryWithBackoff(fn);

        expect(fn).toHaveBeenCalledTimes(2);
    });
});
