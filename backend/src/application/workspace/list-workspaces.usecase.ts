import { prisma } from "../../infrastructure/db/prisma";

export class ListWorkspacesUseCase {
    async execute(userId: string) {
        return prisma.workspace.findMany({
            where: {
                members: {
                    some: { userId }
                }
            },
            include: {
                project: true,
                members: true
            }
        });
    }
}
