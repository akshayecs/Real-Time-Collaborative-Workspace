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
                url: "/api/v1",
                description: "Production",
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

    apis: [
        "./src/interfaces/http/routes/**/*.{ts,js}",
        "./src/interfaces/http/controllers/**/*.{ts,js}",
        "./dist/interfaces/http/routes/**/*.js",
        "./dist/interfaces/http/controllers/**/*.js",
    ],
});
