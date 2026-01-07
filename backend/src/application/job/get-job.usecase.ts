import { prisma } from "../../infrastructure/db/prisma";

export class GetJobUseCase {
    async execute(jobId: string) {
        return prisma.job.findUnique({ where: { id: jobId } });
    }
}
