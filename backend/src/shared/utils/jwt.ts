import jwt, { SignOptions, JwtPayload, Secret } from "jsonwebtoken";
import { env } from "../../config/env";

const ACCESS_SECRET: Secret = env.JWT_ACCESS_SECRET;
const REFRESH_SECRET: Secret = env.JWT_REFRESH_SECRET;

const ACCESS_EXPIRES_IN: SignOptions["expiresIn"] = "15m";
const REFRESH_EXPIRES_IN: SignOptions["expiresIn"] = "7d";

export const signAccessToken = (payload: JwtPayload): string => {
    const options: SignOptions = {
        expiresIn: ACCESS_EXPIRES_IN
    };

    return jwt.sign(payload, ACCESS_SECRET, options);
};

export const signRefreshToken = (payload: JwtPayload): string => {
    const options: SignOptions = {
        expiresIn: REFRESH_EXPIRES_IN
    };

    return jwt.sign(payload, REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};
