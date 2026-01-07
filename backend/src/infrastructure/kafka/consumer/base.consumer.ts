import { sendToDLQ } from "../producer/dlq.producer";
import { shouldRetry } from "../retry/retry.strategy";
import { getBackoffDelay } from "../retry/backoff.util";
import { IdempotencyService } from "../idempotency/idempotency.service";

export abstract class BaseKafkaConsumer {
    abstract handle(message: any): Promise<void>;

    async process(message: any) {
        const { idempotencyKey, retryCount = 0 } = message;

        if (await IdempotencyService.hasProcessed(idempotencyKey)) {
            return;
        }

        try {
            await this.handle(message);
            await IdempotencyService.markProcessed(idempotencyKey);
        } catch (err: any) {
            if (shouldRetry(retryCount)) {
                const delay = getBackoffDelay(retryCount);
                await new Promise(res => setTimeout(res, delay));
                throw { ...message, retryCount: retryCount + 1 };
            }

            await sendToDLQ(message, err.message);
        }
    }
}
