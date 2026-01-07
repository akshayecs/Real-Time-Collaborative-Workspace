import { ActivityLogModel } from "../../infrastructure/mongo/activity-log.model";

export class ActivityLogger {
    async log(
        workspaceId: string,
        eventType: string,
        payload?: Record<string, any>,
        userId?: string
    ) {
        await ActivityLogModel.create({
            workspaceId,
            eventType,
            payload,
            userId
        });
    }
}
