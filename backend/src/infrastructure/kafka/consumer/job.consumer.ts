import { BaseKafkaConsumer } from "./base.consumer";

export class JobConsumer extends BaseKafkaConsumer {
    async handle(message: any) {
        // Example business logic
        if (!message.payload) {
            throw new Error("Invalid job payload");
        }

        // Do actual work here
        console.log("Processing job:", message.payload);
    }
}
