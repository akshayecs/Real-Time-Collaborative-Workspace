import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Permission } from "../../../shared/types/permissions";
import { requirePermission } from "../../../infrastructure/http/middlewares/rbac.middleware";

const router = Router();
const controller = new WorkspaceController();
/**
 * @swagger
 * tags:
 *   name: Workspace
 *   description: Workspace management
 */

/**
 * @swagger
 * /api/v1/workspaces:
 *   post:
 *     summary: Create workspace
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Workspace created
 */

router.post("/", authMiddleware, controller.create);
router.get("/", authMiddleware, controller.list);

router.post(
    "/:workspaceId/invite",
    authMiddleware,
    authorize(Permission.WORKSPACE_MANAGE),
    controller.invite
);
/**
 * @swagger
 * /api/v1/workspaces/{workspaceId}/members/{userId}/role:
 *   put:
 *     summary: Update workspace member role
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *       - in: path
 *         name: userId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [OWNER, ADMIN, MEMBER]
 *     responses:
 *       200:
 *         description: Role updated
 */

// Updated to match your exact URL requirement
router.put(
    "/:workspaceId/members/:userId",
    authMiddleware,
    authorize(Permission.WORKSPACE_MANAGE), // Ensure this matches your middleware name
    controller.updateMemberRole
);
export default router;
