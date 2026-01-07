import { kafkaProducer } from "./kafka.client";
import { JobMessage } from "./job.types";

export const publishJob = async <T>(topic: string, message: JobMessage<T>) => {
    await kafkaProducer.send({
        topic,
        messages: [
            {
                key: message.jobId,
                value: JSON.stringify(message),
            },
        ],
    });
};
