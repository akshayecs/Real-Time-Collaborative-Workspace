import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'test-secret') as any;

        req.user = {
            id: payload.userId || payload.id || 'test-user',
            email: payload.email || 'test@example.com'
        };

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};