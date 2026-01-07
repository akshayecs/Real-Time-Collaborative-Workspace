import { prisma } from "../../infrastructure/db/prisma";
import { hashPassword } from "../../shared/utils/password";

export class RegisterUseCase {
    async execute(email: string, password: string, name: string) {
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) throw new Error("User already exists");

        const passwordHash = await hashPassword(password);

        return prisma.user.create({
            data: {
                email: email,
                passwordHash: passwordHash,
                name: name
            }
        })
    }
}
