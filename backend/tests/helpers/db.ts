import { prisma } from "../../src/infrastructure/db/prisma";

export async function cleanDatabase() {
    await prisma.refreshToken.deleteMany();
    await prisma.workspaceMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.user.deleteMany();
}

export async function resetDatabase() {
    await prisma.refreshToken.deleteMany();
    await prisma.workspaceMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.user.deleteMany();
}
