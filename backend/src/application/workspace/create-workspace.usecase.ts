import { prisma as defaultPrisma } from '../../infrastructure/db/prisma';
import { WorkspaceRole } from "@prisma/client";
export class CreateWorkspaceUseCase {
    // Allow passing a mock prisma, but default to the real one
    constructor(private prisma = defaultPrisma) { }

    async execute(name: string, projectId: string, ownerId: string) {
        if (!projectId) {
            throw new Error("Project ID is required to create a workspace");
        }
        const workspace = await this.prisma.workspace.create({
            data: {
                name: name,
                projectId: projectId // This must NOT be undefined }
            }
        })

        await this.prisma.workspaceMember.create({
            data: {
                workspaceId: workspace.id,
                userId: ownerId,
                role: WorkspaceRole.OWNER, // Prisma enum
                invitedById: ownerId
            },
        });

        return workspace;
    }
}