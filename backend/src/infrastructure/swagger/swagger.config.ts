import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Real-Time Collaborative Workspace API",
            version: "1.0.0",
            description: "Backend APIs for Real-time Collaboration Platform",
        },
        servers: [
            {
                url: "http://localhost:4000/api/v1",
                description: "Local Development",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },

    // 👇 Where Swagger reads JSDoc from
    apis: [
        "./src/interfaces/http/routes/**/*.ts",
        "./src/interfaces/http/controllers/**/*.ts",
        "./src/application/**/*.ts",
    ],
});
