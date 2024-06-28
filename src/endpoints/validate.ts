import jwt, {JwtPayload, VerifyErrors} from 'jsonwebtoken';
import { Request, Response } from 'express';
import { config } from 'dotenv';
import {addNewRefreshToken, checkForRefresh, findAndRemoveRefreshTokensByUserId, findUser} from "../persist/actions";
import * as bcrypt from "bcrypt";

config();

export const login = async (req: Request, res: Response) => {
    console.log("\nLogin request received.");

    try {
        const username = req.body.username;
        const password = req.body.password;
        if (!username) {
            const message = 'Username is required';
            console.log(message);
            res.status(400).json({ message });
            return;
        }

        const foundUser = await findUser(username);

        if (!foundUser) {
            const message = 'There was no user found with the given credentials';
            console.log(message);
            res.status(404).json({ message });
            return;
        }


        if (!(foundUser["username"] === username && await bcrypt.compare(password, foundUser["passwordHash"]))) {
            const message = 'Invalid password credentials';
            console.log(message);
            res.status(401).json({ message });
            return;
        }

        console.log("Result of removing refresh tokens from user " + foundUser["_id"] +
            ": " + await findAndRemoveRefreshTokensByUserId(foundUser["_id"]) + ".");

        const user = { name: username, date: Date.now() };
        const token = await generateAccessToken(user, true);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!);

        const result = await addNewRefreshToken(foundUser["_id"], refreshToken);

        if (!result) {
            const message = 'There was an issue adding refresh token to the database.';
            console.warn(message);
            res.status(500).json({ message });
            return;
        }

        console.log("Result of new refresh token added: " + result + ".");
        res.json({ token, refreshToken, user: {...user, id: foundUser["_id"]} });
    } catch (e: any) {
        console.error(e.message);
        res.sendStatus(500);
    }
};

export const refresh = async (req: Request, res: Response) => {
    console.log("\nRefresh request received.");

    const refreshToken = req.body.token;

    if (!refreshToken) {
        console.log("Rejected.");
        res.sendStatus(400);
        return;
    }

    if (!(await checkForRefresh(refreshToken))) {
        console.log("Rejected.");
        res.status(401).json({
            message: "No such token found."
        });
        return;
    }

    console.log("Verifying refresh token...")
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (error: VerifyErrors | null | boolean, decoded: JwtPayload | string | undefined) => {
        if (error) {
            console.log("Verification failed.")
            res.status(401).json({
                message: "Could not verify refresh token."
            });
            return;
        }

        console.log("Verification successful.")

        //TODO limit the amount of refresh tokens that can be in the db for one user.
        const token = typeof decoded !== 'string' && (await generateAccessToken({ name: decoded!.name}, false));
        res.json({ token });
    });
};

function generateAccessToken(user: { name: string}, createdByLogin: boolean) {
    console.log("Generating access token...");
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const token = jwt.sign({ name: user.name, date: Date.now(), createdByLogin }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '30m' });
                console.log("New access token generated. (Created by login: " + (jwt.decode(token) as JwtPayload).createdByLogin + ").");
                resolve(token);
            } catch (error) {
                reject(new Error("Failure to generate a token."));
            }
        });
    });
}