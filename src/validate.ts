import jwt, {JwtPayload, VerifyCallback, VerifyErrors} from 'jsonwebtoken';
import { Request, Response } from 'express';
import { config } from 'dotenv';
import {refreshTokens} from "./index";

config();

export const login = (req: Request, res: Response): void => {
    const username = req.body.username;
    if (!username) {
        res.status(400).json({ message: 'Username is required' });
        return;
    }

    const user = { name: username };
    const token = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!);

    refreshTokens.push(refreshToken);
    res.json({ token, refreshToken });
};

export const refresh = (req: Request, res: Response): void => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }

    if (!refreshTokens.includes(refreshToken)) {
        res.sendStatus(403);
        return;
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (error: VerifyErrors | null | boolean, decoded: JwtPayload | string | undefined) => {
        if (error) {
            res.sendStatus(403);
            return;
        }


        const token = typeof decoded !== 'string' && generateAccessToken({ name: decoded!.name });
        res.json({ token });
    });
};

function generateAccessToken(user: { name: string }): string {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '30m' });
}
