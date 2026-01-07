import { getBackoffDelay } from "../../../src/infrastructure/kafka/retry/backoff.util";

describe("Backoff Utils", () => {
    it("increases delay exponentially", () => {
        expect(getBackoffDelay(1)).toBe(2000);
        expect(getBackoffDelay(2)).toBe(4000);
    });

    it("caps delay at max", () => {
        expect(getBackoffDelay(10, 1000, 5000)).toBe(5000);
    });
});
