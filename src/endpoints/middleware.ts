import jwt, {JwtPayload} from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import {config} from "dotenv";

config();

/**
 * Example implementation:
 *
 * const posts = [
 *     {
 *         username: "Kyle",
 *         title: "Post 1"
 *     },
 *     {
 *         username: "Jim",
 *         title: "Post 2"
 *     }
 * ]
 *
 * app.get("/posts", authenticationMiddleware, (req, res) => {
 *     res.json(posts.filter(post => post.username === req.user.name));
 * });
 */

export function authenticationMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.sendStatus(401);
        return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, decoded) => {
        if (error) {
            res.sendStatus(403);
            return;
        }

        req.body.user = decoded as JwtPayload;
        next();
    });
}
