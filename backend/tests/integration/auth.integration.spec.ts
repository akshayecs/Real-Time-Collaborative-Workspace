import { request } from "../setup";
import { resetDatabase } from "../helpers/db";

describe("Auth Integration", () => {
    let accessToken: string;

    beforeAll(async () => {
        await resetDatabase();
    });

    it("registers a user", async () => {
        const res = await request
            .post("/api/v1/auth/register")
            .send({
                email: "test@example.com",
                password: "Password123!",
                name: "Test User",
            });

        expect(res.status).toBe(201);
    });

    it("logs in user", async () => {
        const res = await request
            .post("/api/v1/auth/login")
            .send({
                email: "test@example.com",
                password: "Password123!",
            });

        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();

        accessToken = res.body.accessToken;
    });

    it("blocks protected route without token", async () => {
        const res = await request.get("/api/v1/workspaces");
        expect(res.status).toBe(401);
    });

    it("allows protected route with token", async () => {
        const res = await request
            .get("/api/v1/workspaces")
            .set("Authorization", `Bearer ${accessToken}`); // ✅ correct

        expect(res.status).toBe(200);
    });
});
