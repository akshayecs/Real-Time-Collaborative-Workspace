import { Request, Response, NextFunction } from "express";
import { AuthorizationService } from "../../../application/auth/authorization.service";
import { Permission } from "../../../shared/types/permissions";

const authz = new AuthorizationService();

export const requirePermission =
    (permission: Permission) =>
        async (req: Request, res: Response, next: NextFunction) => {
            const userId = (req as any).user?.id;
            const workspaceId = req.params.workspaceId;

            if (!userId || !workspaceId) {
                return res.status(400).json({ message: "Invalid RBAC context" });
            }

            const allowed = await authz.hasPermission(
                userId,
                workspaceId,
                permission
            );

            if (!allowed) {
                return res.status(403).json({ message: "Forbidden" });
            }

            next();
        };
