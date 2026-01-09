import { getKafkaProducer } from "./kafka.producer";
import { JobMessage } from "./job.types";

export const publishJob = async <T>(
    topic: string,
    message: JobMessage<T>
) => {
    // ✅ Lazy & optional Kafka
    const producer = await getKafkaProducer();

    if (!producer) {
        // Kafka disabled → silently skip
        return;
    }

    await producer.send({
        topic,
        messages: [
            {
                key: message.jobId,
                value: JSON.stringify(message),
            },
        ],
    });
};
