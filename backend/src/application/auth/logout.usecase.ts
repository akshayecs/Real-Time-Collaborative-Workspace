import crypto from "crypto";
import { prisma } from "../../infrastructure/db/prisma";

export class LogoutUseCase {
    async execute(refreshToken: string) {
        const tokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        await prisma.refreshToken.updateMany({
            where: { tokenHash },
            data: { revoked: true }
        });
    }
}
