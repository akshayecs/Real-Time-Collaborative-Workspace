export enum JobType {
    DOCUMENT_SYNC = "DOCUMENT_SYNC",
    AUDIT_LOG = "AUDIT_LOG"
}

export interface KafkaJob<T = any> {
    id: string;
    type: JobType;
    payload: T;
    idempotencyKey: string;
    retryCount: number;
    maxRetries: number;
}
