import { prisma } from "../../infrastructure/db/prisma";
import { WorkspaceRole } from "@prisma/client";
import { AuthorizationService } from "../auth/authorization.service";
import { Permission } from "../../shared/types/permissions";
export class UpdateMemberRoleUseCase {
    async execute(
        workspaceId: string,
        requesterId: string,
        targetUserId: string,
        newRole: WorkspaceRole
    ) {
        const requesterMembership = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: requesterId
                }
            }
        });

        if (!requesterMembership) {
            throw new Error("Not a workspace member");
        }
        const authz = new AuthorizationService();
        await authz.assertPermission(
            requesterId,
            workspaceId,
            Permission.WORKSPACE_MANAGE
        );

        if (requesterMembership.role !== "OWNER") {
            throw new Error("Only OWNER can update roles");
        }

        return prisma.workspaceMember.update({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: targetUserId
                }
            },
            data: { role: newRole }
        });
    }
}
