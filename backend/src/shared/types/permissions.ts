import { WorkspaceRole } from "@prisma/client";

export enum Permission {
    WORKSPACE_MANAGE = "WORKSPACE_MANAGE",
    PROJECT_CREATE = "PROJECT_CREATE",
    PROJECT_EDIT = "PROJECT_EDIT",
    PROJECT_DELETE = "PROJECT_DELETE",
    MEMBER_INVITE = "MEMBER_INVITE",
}

export const RolePermissions: Record<WorkspaceRole, Permission[]> = {
    OWNER: [
        Permission.WORKSPACE_MANAGE,
        Permission.PROJECT_CREATE,
        Permission.PROJECT_EDIT,
        Permission.PROJECT_DELETE,
        Permission.MEMBER_INVITE,
    ],

    EDITOR: [
        Permission.PROJECT_CREATE,
        Permission.PROJECT_EDIT,
    ],

    VIEWER: [],

    ADMIN: [
        Permission.PROJECT_CREATE,
        Permission.WORKSPACE_MANAGE,
    ],
};
