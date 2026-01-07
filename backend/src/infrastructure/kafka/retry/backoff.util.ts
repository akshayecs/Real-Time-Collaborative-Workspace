export const getBackoffDelay = (
    attempt: number,
    baseDelay = 1000,
    maxDelay = 30000
): number => {
    const delay = baseDelay * Math.pow(2, attempt);
    return Math.min(delay, maxDelay);
};
