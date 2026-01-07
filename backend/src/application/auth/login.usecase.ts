// src/application/auth/login.usecase.ts
import { prisma as db } from '../../infrastructure/db/prisma';
import { comparePassword } from "../../shared/utils/password";
import { signAccessToken, signRefreshToken } from "../../shared/utils/jwt";
import crypto from "crypto";

export class LoginUseCase {
    constructor(private prisma = db) { }

    async execute(email: string, password: string) {
        // 1. Changed prisma to this.prisma
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("Invalid credentials");

        const valid = await comparePassword(password, user.passwordHash);
        if (!valid) throw new Error("Invalid credentials");

        const accessToken = signAccessToken({ userId: user.id });
        const refreshToken = signRefreshToken({ userId: user.id });

        // 2. Changed prisma to this.prisma
        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: crypto
                    .createHash("sha256")
                    .update(refreshToken)
                    .digest("hex"),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        return { accessToken, refreshToken };
    }
}