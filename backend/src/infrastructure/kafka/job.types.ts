export interface JobMessage<T = any> {
    jobId: string;
    type: string;
    payload: T;
    retryCount: number;
    createdAt: string;
}
