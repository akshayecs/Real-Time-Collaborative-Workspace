// tests/integration/auth.errors.spec.ts

import request from "supertest";
import { app } from "../setup";

describe("Auth Error Handling", () => {
    it("returns 401 for invalid credentials", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "wrong@example.com",
                password: "wrong-password",
            });

        expect(res.status).toBe(401);
        expect(res.body.error).toBeDefined();
    });

    it("blocks protected route without token", async () => {
        const res = await request(app).get("/api/v1/workspaces");

        expect(res.status).toBe(401);
    });

    it("blocks protected route with invalid token", async () => {
        const res = await request(app)
            .get("/api/v1/workspaces")
            .set("Authorization", "Bearer invalid.token.here");

        expect(res.status).toBe(401);
    });
});
