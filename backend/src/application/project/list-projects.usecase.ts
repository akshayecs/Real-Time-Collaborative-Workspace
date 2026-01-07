import { prisma } from "../../infrastructure/db/prisma";

export class ListProjectsUseCase {
    async execute(userId: string) {
        return prisma.project.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    {
                        workspaces: {
                            some: {
                                members: {
                                    some: { userId }
                                }
                            }
                        }
                    }
                ]
            },
            include: {
                workspaces: true
            }
        });
    }
}
