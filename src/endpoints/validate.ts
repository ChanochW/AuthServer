import jwt, {JwtPayload, VerifyErrors} from 'jsonwebtoken';
import { Request, Response } from 'express';
import { config } from 'dotenv';
import {addNewRefreshToken, checkForRefresh, findAndRemoveRefreshTokensByUserId, findUser} from "../persist/actions";
import * as bcrypt from "bcrypt";

config();

export const login = async (req: Request, res: Response) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        if (!username) {
            res.status(400).json({ message: 'Username is required' });
            return;
        }

        const foundUser = await findUser(username);

        if (!foundUser) {
            res.status(400).json({ message: 'There was no user found with the given credentials' });
            return;
        }


        if (!(foundUser["username"] === username && await bcrypt.compare(password, foundUser["passwordHash"]))) {
            res.status(400).json({ message: 'Invalid password credentials' });
            return;
        }

        console.log("Result of removing refresh tokens from user " + foundUser["_id"] +
            ": " + await findAndRemoveRefreshTokensByUserId(foundUser["_id"]));

        const user = { name: username + Date.now() };
        const token = await generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!);

        const result = await addNewRefreshToken(foundUser["_id"], refreshToken);

        if (!result) {
            res.status(500).json({ message: 'There was an issue adding refresh token to the database.' });
            return;
        }

        console.log("Result of new refresh token added: " + result);
        res.json({ token, refreshToken, user: {...user, id: foundUser["_id"]} });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

export const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }

    if (!(await checkForRefresh(refreshToken))) {
        res.status(403).json({
            message: "No such token found."
        });
        return;
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (error: VerifyErrors | null | boolean, decoded: JwtPayload | string | undefined) => {
        if (error) {
            res.status(403).json({
                message: "Could not verify refresh token."
            });
            return;
        }
        //TODO limit the amount of refresh tokens that can be in the db for one user.
        const token = typeof decoded !== 'string' && (await generateAccessToken({ name: decoded!.name + Date.now()}));
        res.json({ token });
    });
};

export function generateAccessToken(user: { name: string }) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const token = jwt.sign({ name: user.name + Date.now() }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '30m' });
                resolve(token);
            } catch (error) {
                reject(new Error("Failure to generate a token."));
            }
        });
    });
}