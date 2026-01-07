import { prisma as defaultPrisma } from "../../infrastructure/db/prisma";
import { WorkspaceRole } from "@prisma/client";

export class InviteUserUseCase {
    constructor(private prisma = defaultPrisma) { }

    async execute(
        workspaceId: string,
        email: string,
        invitedByUserId: string,
        role: WorkspaceRole
    ) {
        if (!email) {
            throw new Error("Email is required");
        }

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const existingMember =
            await this.prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId,
                        userId: user.id,
                    },
                },
            });

        if (existingMember) {
            throw new Error("User already a workspace member");
        }

        return this.prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId: user.id,
                role,
                invitedById: invitedByUserId,
            },
        });
    }
}
