import { Permission } from "../../src/shared/types/permissions";

const mockGetRBACCache = jest.fn();
const mockSetRBACCache = jest.fn();
const mockFindUnique = jest.fn();

jest.mock("../../src/infrastructure/redis/rbac.cache", () => ({
    getRBACCache: (...args: any[]) => mockGetRBACCache(...args),
    setRBACCache: (...args: any[]) => mockSetRBACCache(...args),
}));

jest.mock("../../src/infrastructure/db/prisma", () => ({
    prisma: {
        workspaceMember: {
            findUnique: (...args: any[]) => mockFindUnique(...args),
        },
    },
}));

jest.mock("kafkajs", () => ({
    Kafka: jest.fn(() => ({
        producer: () => ({
            connect: jest.fn(),
            send: jest.fn(),
            disconnect: jest.fn(),
        }),
        consumer: () => ({
            connect: jest.fn(),
            subscribe: jest.fn(),
            run: jest.fn(),
            disconnect: jest.fn(),
        }),
    })),
}));

jest.mock("../../src/shared/types/permissions", () => ({
    Permission: {
        WORKSPACE_MANAGE: "WORKSPACE_MANAGE",
        PROJECT_CREATE: "PROJECT_CREATE",
        PROJECT_EDIT: "PROJECT_EDIT",
        PROJECT_DELETE: "PROJECT_DELETE",
        MEMBER_INVITE: "MEMBER_INVITE",
    },
    RolePermissions: {
        OWNER: [
            "WORKSPACE_MANAGE",
            "PROJECT_CREATE",
            "PROJECT_EDIT",
            "PROJECT_DELETE",
            "MEMBER_INVITE",
        ],
        EDITOR: ["PROJECT_CREATE", "PROJECT_EDIT"],
        VIEWER: [],
        ADMIN: ["PROJECT_CREATE", "WORKSPACE_MANAGE"],
    },
}));


describe("AuthorizationService", () => {
    let AuthorizationService: any;
    let service: any;

    beforeEach(async () => {
        jest.resetModules();
        jest.clearAllMocks();

        const module = await import(
            "../../src/application/auth/authorization.service"
        );

        AuthorizationService = module.AuthorizationService;
        service = new AuthorizationService();
    });

    it("returns true when permission exists (DB fallback)", async () => {
        mockGetRBACCache.mockResolvedValue(null);

        mockFindUnique.mockResolvedValue({
            userId: "user1",
            workspaceId: "workspace1",
            role: "OWNER",
        });

        const result = await service.hasPermission(
            "user1",
            "workspace1",
            Permission.PROJECT_CREATE
        );

        expect(result).toBe(true);
        expect(mockSetRBACCache).toHaveBeenCalledTimes(1);
    });

    it("returns true when permission exists (cache hit)", async () => {
        mockGetRBACCache.mockResolvedValue({
            role: "OWNER",
            permissions: [Permission.PROJECT_CREATE],
        });

        const result = await service.hasPermission(
            "user1",
            "workspace1",
            Permission.PROJECT_CREATE
        );

        expect(result).toBe(true);
        expect(mockFindUnique).not.toHaveBeenCalled();
    });

    it("returns false if membership does not exist", async () => {
        mockGetRBACCache.mockResolvedValue(null);
        mockFindUnique.mockResolvedValue(null);

        const result = await service.hasPermission(
            "user1",
            "workspace1",
            Permission.PROJECT_CREATE
        );

        expect(result).toBe(false);
    });
});
