import { Permission } from "../../shared/types/permissions";

export { };

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                // Add any other properties your JWT middleware attaches
            };
        }
    }
}