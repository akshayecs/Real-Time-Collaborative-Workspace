import crypto from "crypto";
import { prisma } from "../../infrastructure/db/prisma";
import {
    verifyRefreshToken,
    signAccessToken,
    signRefreshToken
} from "../../shared/utils/jwt";

export class RefreshTokenUseCase {
    async execute(refreshToken: string) {
        // 1. Verify JWT
        const payload = verifyRefreshToken(refreshToken);

        // 2. Hash token
        const tokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        // 3. Check DB record
        const storedToken = await prisma.refreshToken.findFirst({
            where: {
                userId: payload.userId,
                tokenHash,
                revoked: false,
                expiresAt: { gt: new Date() }
            }
        });

        if (!storedToken) {
            throw new Error("Invalid refresh token");
        }

        // 4. Revoke old token (rotation)
        await prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revoked: true }
        });

        // 5. Issue new tokens
        const newAccessToken = signAccessToken({
            userId: payload.userId
        });

        const newRefreshToken = signRefreshToken({
            userId: payload.userId
        });

        // 6. Store new refresh token
        await prisma.refreshToken.create({
            data: {
                userId: payload.userId,
                tokenHash: crypto
                    .createHash("sha256")
                    .update(newRefreshToken)
                    .digest("hex"),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }
}
