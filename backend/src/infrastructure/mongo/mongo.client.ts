import mongoose from "mongoose";
import { env } from "../../config/env";
import { logger } from "../../config/logger";

export const connectMongo = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        logger.info("✅ MongoDB connected");
    } catch (err) {
        logger.error("❌ MongoDB connection failed", err);
        process.exit(1);
    }
};
