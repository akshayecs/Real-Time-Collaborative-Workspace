import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    PORT: z.string().default("4000"),

    API_VERSION: z.string(),

    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string(),

    DATABASE_URL: z.string().url(),
    MONGODB_URI: z.string().url(),
    REDIS_URL: z.string().url(),

    KAFKA_BROKER: z.string(),

    RATE_LIMIT_WINDOW_MS: z.string(),
    RATE_LIMIT_MAX_REQUESTS: z.string(),

    ENABLE_WEBSOCKETS: z.string(),
    ENABLE_JOBS: z.string()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("❌ Invalid environment variables", parsed.error.format());
    process.exit(1);
}

export const env = {
    ...parsed.data,
    PORT: Number(parsed.data.PORT),
    RATE_LIMIT_WINDOW_MS: Number(parsed.data.RATE_LIMIT_WINDOW_MS),
    RATE_LIMIT_MAX_REQUESTS: Number(parsed.data.RATE_LIMIT_MAX_REQUESTS),
    ENABLE_WEBSOCKETS: parsed.data.ENABLE_WEBSOCKETS === "true",
    ENABLE_JOBS: parsed.data.ENABLE_JOBS === "true"
};
