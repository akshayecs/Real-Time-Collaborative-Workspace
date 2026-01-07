import { prisma } from "../../infrastructure/db/prisma";
import { invalidateRBACCache } from "../../infrastructure/redis/rbac.cache";

export class RemoveMemberUseCase {
    async execute(workspaceId: string, userId: string) {
        // 1️⃣ Remove membership
        await prisma.workspaceMember.delete({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId
                }
            }
        });

        // 2️⃣ Invalidate RBAC cache
        await invalidateRBACCache(workspaceId, userId);
    }
}
