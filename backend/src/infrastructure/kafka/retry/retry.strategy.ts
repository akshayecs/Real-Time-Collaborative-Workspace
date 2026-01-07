export const MAX_RETRY_COUNT = 5;

export const shouldRetry = (attempt: number): boolean => {
    return attempt < MAX_RETRY_COUNT;
};
