import { KafkaJob, JobType } from "../../shared/types/job.types";

export async function handleJob(job: KafkaJob<any>) {
    switch (job.type) {
        case JobType.DOCUMENT_SYNC:
            await handleDocumentSync(job.payload);
            break;

        case JobType.AUDIT_LOG:
            await handleAuditLog(job.payload);
            break;

        default:
            throw new Error(`Unknown job type: ${job.type}`);
    }
}

async function handleDocumentSync(payload: { projectId: string }) {
    console.log("📄 Syncing document:", payload.projectId);
    // DB sync, socket emit, etc
}

async function handleAuditLog(payload: any) {
    console.log("📝 Audit log:", payload);
}
