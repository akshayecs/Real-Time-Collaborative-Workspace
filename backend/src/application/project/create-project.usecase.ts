import { prisma } from "../../infrastructure/db/prisma";

export class CreateProjectUseCase {
    async execute(ownerId: string, name: string, description?: string) {
        return prisma.project.create({
            data: {
                name,
                description,
                ownerId
            }
        });
    }
}
