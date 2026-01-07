import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../../shared/utils/jwt";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.userId, email: payload.email };
        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
