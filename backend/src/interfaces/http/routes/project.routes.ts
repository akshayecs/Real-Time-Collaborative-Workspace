import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Permission } from "../../../shared/types/permissions";
import { requirePermission } from "../../../infrastructure/http/middlewares/rbac.middleware";

const router = Router();
const controller = new ProjectController();
/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Project management
 */

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Create project
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, workspaceId]
 *             properties:
 *               name:
 *                 type: string
 *               workspaceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 */

router.post("/", authMiddleware, controller.create);
router.get("/", authMiddleware, controller.list);

export default router;
