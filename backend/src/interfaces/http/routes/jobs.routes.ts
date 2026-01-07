import { Router } from "express";
import { emitJob } from "../controllers/jobs.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Background job processing
 */

/**
 * @swagger
 * /api/v1/jobs/emit:
 *   post:
 *     summary: Trigger a background job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, payload]
 *             properties:
 *               type:
 *                 type: string
 *                 example: DOCUMENT_SYNC
 *               payload:
 *                 type: object
 *                 example:
 *                   projectId: "uuid"
 *     responses:
 *       202:
 *         description: Job accepted for processing
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/",
    authMiddleware,
    emitJob
);

export default router;
