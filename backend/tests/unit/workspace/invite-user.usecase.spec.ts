import { prismaMock } from "../../singleton";
import { InviteUserUseCase } from "../../../src/application/workspace/invite-user.usecase";
import { WorkspaceRole } from "@prisma/client";

describe("InviteUserUseCase", () => {
    let useCase: InviteUserUseCase;

    beforeEach(() => {
        useCase = new InviteUserUseCase(prismaMock as any);
    });

    it("throws error if user already a workspace member", async () => {
        prismaMock.user.findUnique.mockResolvedValue({
            id: "u1",
            email: "test@test.com",
        } as any);

        prismaMock.workspaceMember.findUnique.mockResolvedValue({
            userId: "u1",
            workspaceId: "w1",
        } as any);

        await expect(
            useCase.execute(
                "w1",
                "test@test.com",
                "inviter-user-id",
                WorkspaceRole.ADMIN
            )
        ).rejects.toThrow("User already a workspace member");
    });
});
