import { PrismaClient } from "@prisma/client";
import { logger } from "../../config/logger";

export const prisma = new PrismaClient({
    log: ["error", "warn"]
});
export { JobType } from "@prisma/client";

export const connectPrisma = async () => {
    try {
        await prisma.$connect();
        logger.info("✅ PostgreSQL connected via Prisma");
    } catch (error) {
        logger.error("❌ Prisma connection failed", error);
        process.exit(1);
    }
};
