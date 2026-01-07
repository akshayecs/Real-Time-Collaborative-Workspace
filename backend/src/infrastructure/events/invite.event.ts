// src/infrastructure/events/invite.event.ts

export interface WorkspaceInviteEvent {
    workspaceId: string;
    email: string;
    role: string;
    invitedByUserId: string;
}

/**
 * Publishes a workspace invite event.
 *
 * NOTE:
 * - This is intentionally a NO-OP implementation.
 * - In production, this can publish to Kafka, RabbitMQ,
 *   or send an email.
 * - In tests, this function is fully mocked.
 */
export const publishWorkspaceInvite = async (
    _payload: WorkspaceInviteEvent
): Promise<void> => {
    // Intentionally empty (side-effect free)
};
