import { shouldRetry, MAX_RETRY_COUNT } from "./retry.strategy";
import { getBackoffDelay } from "./backoff.util";

export const retryWithBackoff = async <T>(
    fn: () => Promise<T>
): Promise<T> => {
    let attempt = 0;

    while (true) {
        try {
            return await fn();
        } catch (error) {
            attempt++;

            if (!shouldRetry(attempt)) {
                throw error;
            }

            const delay = getBackoffDelay(attempt);
            await new Promise(res => setTimeout(res, delay));
        }
    }
};
