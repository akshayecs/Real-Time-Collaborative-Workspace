import { request } from "../setup";
import { resetDatabase } from "../helpers/db";
import { KafkaJob, JobType } from "../../src/shared/types/job.types";

describe("Jobs API", () => {
    let token: string;

    beforeAll(async () => {
        await resetDatabase();
        const registerRes = await request
            .post("/api/v1/auth/register")
            .send({
                email: "jobs@test.com",
                password: "Password123!",
                name: "Jobs Test User",
            });

        expect(registerRes.status).toBe(201);
        const loginRes = await request
            .post("/api/v1/auth/login")
            .send({
                email: "jobs@test.com",
                password: "Password123!",
            });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body.accessToken).toBeDefined();

        token = loginRes.body.accessToken;
    });

    it("emits a background job", async () => {
        const job: KafkaJob = {
            id: "job-1",
            type: "EMAIL" as JobType,
            payload: {
                to: "test@test.com",
                subject: "Test email",
            },
            idempotencyKey: "job-1",
            retryCount: 0,
            maxRetries: 3,
        };

        const res = await request
            .post("/api/v1/jobs")
            .set("Authorization", `Bearer ${token}`)
            .send(job);

        expect(res.status).toBe(202);
    });
});
