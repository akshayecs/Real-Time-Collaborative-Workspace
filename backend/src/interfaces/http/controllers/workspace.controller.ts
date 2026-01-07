import { Request, Response, NextFunction } from 'express';
import { CreateWorkspaceUseCase } from '../../../application/workspace/create-workspace.usecase';
import { InviteUserUseCase } from '../../../application/workspace/invite-user.usecase';
import { PrismaClient } from '@prisma/client';
import { redisClient } from "../../../config/redis"; // Adjust path as needed

const prisma = new PrismaClient();

export class WorkspaceController {
    async invite(req: any, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const { workspaceId } = req.params;
            const { email, role } = req.body;

            if (!email || !role) {
                return res.status(400).json({ error: "Email and role are required" });
            }

            const invitedBy = req.user.id;

            const membership = await new InviteUserUseCase().execute(
                workspaceId,
                email,
                invitedBy,
                role
            );

            return res.status(201).json(membership);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async create(req: any, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ error: "Unauthorized" });

            const { name, projectId } = req.body;
            const ownerId = req.user.id;

            const workspace = await new CreateWorkspaceUseCase().execute(
                name,
                projectId,
                ownerId
            );

            return res.status(201).json(workspace);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
    async list(req: any, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ error: "Unauthorized" });
            const workspaces = await prisma.workspace.findMany({
                where: { members: { some: { userId: (req as any).user.id } } }
            });
            return res.status(200).json(workspaces);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateMemberRole(req: Request, res: Response) {
        try {
            const { workspaceId, userId } = req.params;
            const { role } = req.body;

            const updated = await prisma.workspaceMember.update({
                where: { workspaceId_userId: { workspaceId, userId } },
                data: { role }
            });

            const cacheKey = `rbac:${workspaceId}:${userId}`;
            await redisClient.del(cacheKey);

            return res.status(200).json(updated);
        } catch (error: any) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: "Member not found in this workspace" });
            }
            return res.status(400).json({ error: error.message });
        }
    }
}