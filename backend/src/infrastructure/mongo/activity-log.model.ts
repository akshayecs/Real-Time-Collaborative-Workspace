import mongoose, { Schema, Document } from "mongoose";

export interface ActivityLogDocument extends Document {
    workspaceId: string;
    userId?: string;
    eventType: string;
    payload?: Record<string, any>;
    createdAt: Date;
}

const ActivityLogSchema = new Schema<ActivityLogDocument>(
    {
        workspaceId: { type: String, required: true, index: true },
        userId: { type: String },
        eventType: { type: String, required: true },
        payload: { type: Schema.Types.Mixed }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

export const ActivityLogModel = mongoose.model<ActivityLogDocument>(
    "ActivityLog",
    ActivityLogSchema
);
