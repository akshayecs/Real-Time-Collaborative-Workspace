import { ActivityLogModel } from "../../infrastructure/mongo/activity-log.model";

export class ListActivityUseCase {
    async execute(workspaceId: string, limit = 50) {
        return ActivityLogModel.find({ workspaceId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    }
}
