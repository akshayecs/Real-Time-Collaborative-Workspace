import { prisma } from "../../infrastructure/db/prisma";
import { Permission, RolePermissions } from "../../shared/types/permissions";
import {
    getRBACCache,
    setRBACCache
} from "../../infrastructure/redis/rbac.cache";
import { WorkspaceRole } from "@prisma/client";
import { ForbiddenException } from "../../shared/errors/forbidden.exception";

export class AuthorizationService {

    async hasPermission(
        userId: string,
        workspaceId: string,
        permission: Permission
    ): Promise<boolean> {
        const cached = await getRBACCache(workspaceId, userId);

        if (cached) {
            return cached.permissions.includes(permission);
        }

        const membership = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: { workspaceId, userId },
            },
        });
        if (!membership) return false;

        const role = membership.role;
        const permissions = RolePermissions[role] ?? [];

        await setRBACCache(workspaceId, userId, {
            role: role,
            permissions,
        });
        return permissions.includes(permission);

    }

    async assertPermission(
        userId: string,
        workspaceId: string,
        permission: Permission
    ): Promise<void> {
        const allowed = await this.hasPermission(
            userId,
            workspaceId,
            permission
        );

        if (!allowed) {
            throw new ForbiddenException("Insufficient permissions");
        }
    }
}
