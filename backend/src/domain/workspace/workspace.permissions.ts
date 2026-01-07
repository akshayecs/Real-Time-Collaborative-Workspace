import { WorkspaceRole } from "@prisma/client";
import { Permission } from "../../shared/types/permissions";

export const WorkspaceRolePermissions: Record<WorkspaceRole, Permission[]> = {
    OWNER: [
        Permission.WORKSPACE_MANAGE,
        Permission.PROJECT_CREATE,
        Permission.PROJECT_EDIT,
        Permission.PROJECT_DELETE,
    ],
    ADMIN: [
        Permission.WORKSPACE_MANAGE,
        Permission.PROJECT_CREATE,
        Permission.PROJECT_EDIT,
        Permission.PROJECT_DELETE,
    ],
    EDITOR: [
        Permission.PROJECT_CREATE,
        Permission.PROJECT_EDIT,
    ],
    VIEWER: [],
};
