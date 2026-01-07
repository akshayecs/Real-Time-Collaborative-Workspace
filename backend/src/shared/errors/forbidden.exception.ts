// src/shared/errors/forbidden.exception.ts
export class ForbiddenException extends Error {
    public statusCode = 403;

    constructor(message = "Forbidden") {
        super(message);
        this.name = "ForbiddenException";
    }
}
