import { redisClient } from "../../config/redis";
import { Permission } from "../../shared/types/permissions";

const TTL_SECONDS = 300;

export interface RBACCacheValue {
    role: string;
    permissions: Permission[];
}

const buildKey = (workspaceId: string, userId: string) =>
    `rbac:${workspaceId}:${userId}`;

/* ======================================================
   GET
   ====================================================== */
export const getRBACCache = async (
    workspaceId: string,
    userId: string
): Promise<RBACCacheValue | null> => {
    const raw = await redisClient.get(buildKey(workspaceId, userId));
    return raw ? JSON.parse(raw) : null;
};

/* ======================================================
   SET
   ====================================================== */
export const setRBACCache = async (
    workspaceId: string,
    userId: string,
    value: RBACCacheValue
): Promise<void> => {

    await redisClient.set(
        buildKey(workspaceId, userId),
        JSON.stringify(value),
        { EX: TTL_SECONDS }
    );
};

/* ======================================================
   CLEAR / INVALIDATE
   ====================================================== */
export const clearRBACCache = async (
    workspaceId: string,
    userId: string
): Promise<void> => {
    await redisClient.del(buildKey(workspaceId, userId));
};

/**
 * @deprecated use clearRBACCache instead
 */
export const invalidateRBACCache = clearRBACCache;
