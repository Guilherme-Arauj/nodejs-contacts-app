import jwt from "jsonwebtoken";
import { IJwtConfig } from "./IJwtConfig.js";

export class JwtConfig implements IJwtConfig {
    private secretKey: string;

    constructor(secretKey: string) {
        this.secretKey = secretKey;
    }

    public sign(payload: object, expiresIn: string): string {
        return jwt.sign(payload, this.secretKey, { expiresIn } as jwt.SignOptions);
    }

    public verify(token: string): object | string | null {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            return null;
        }
    }
}