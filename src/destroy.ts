import { Request, Response } from 'express';
import {refreshTokens} from "./index";

export const destroy = (req: Request, res: Response): void => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }

    const index = refreshTokens.indexOf(refreshToken);
    if (index !== -1) {
        refreshTokens.splice(index, 1);
    }

    res.sendStatus(204);
};
