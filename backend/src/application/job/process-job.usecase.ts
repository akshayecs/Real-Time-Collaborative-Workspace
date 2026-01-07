export class ProcessJobUseCase {
    async execute(payload: any) {
        // 🔥 REAL business logic here
        console.log("Processing job:", payload);

        // simulate failure if needed
        // throw new Error("Temporary failure");
    }
}
