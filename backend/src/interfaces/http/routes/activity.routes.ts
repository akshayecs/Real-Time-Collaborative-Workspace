import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new ActivityController();
/**
 * @swagger
 * tags:
 *   name: Activity
 *   description: Audit & activity logs
 */

/**
 * @swagger
 * /api/v1/activity:
 *   get:
 *     summary: Get activity logs
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity list
 */

router.get(
    "/workspaces/:workspaceId/activity",
    authMiddleware,
    controller.list
);

export default router;
