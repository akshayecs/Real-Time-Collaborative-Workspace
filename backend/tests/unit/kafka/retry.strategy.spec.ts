import { shouldRetry, MAX_RETRY_COUNT } from "../../../src/infrastructure/kafka/retry/retry.strategy";

describe("Retry Strategy", () => {
    it("retries until max count", () => {
        expect(shouldRetry(0)).toBe(true);
        expect(shouldRetry(MAX_RETRY_COUNT - 1)).toBe(true);
        expect(shouldRetry(MAX_RETRY_COUNT)).toBe(false);
    });
});
