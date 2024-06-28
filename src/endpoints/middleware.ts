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
    console.log("\nAuthenticating with middleware.");

    const authHeader = req.headers['Authorization'];
    if (!authHeader) {
        console.log("Access denied.");
        res.sendStatus(401);
        return;
    }

    const token = typeof authHeader === "string" ? authHeader.split(' ')[1] : null;
    if (!token) {
        console.log("Access denied.");
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, decoded) => {
        if (error) {
            res.sendStatus(403);
            return;
        }

        const payload = (decoded as JwtPayload);

        req.body.username = payload.name;
        req.body.login_access_level = payload.createdByLogin;
        next();
    });
}
