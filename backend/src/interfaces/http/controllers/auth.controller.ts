import { Request, Response, NextFunction } from "express";
import { RegisterUseCase } from "../../../application/auth/register.usecase";
import { LoginUseCase } from "../../../application/auth/login.usecase";
import { RefreshTokenUseCase } from "../../../application/auth/refresh-token.usecase";
import { LogoutUseCase } from "../../../application/auth/logout.usecase";

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, name } = req.body;
            const user = await new RegisterUseCase().execute(email, password, name);
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const tokens = await new LoginUseCase().execute(email, password);
            res.json(tokens);
        } catch (err) {
            next(err);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            const tokens = await new RefreshTokenUseCase().execute(refreshToken);
            res.json(tokens);
        } catch (err) {
            next(err);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            await new LogoutUseCase().execute(refreshToken);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}

