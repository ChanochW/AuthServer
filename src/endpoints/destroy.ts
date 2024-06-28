import { Request, Response } from 'express';
import {checkUserRefreshExists, findAndRemoveRefreshTokensByUserId, findUser} from "../persist/actions";

export const destroy = async (req: Request, res: Response) => {
    console.log("\nDestroy request received.");

    const refreshToken = req.body.token;

    if (!refreshToken) {
        console.log("Rejected.");
        res.sendStatus(400);
        return;
    }

    const username = req.body.username;

    if (!username) {
        console.log("Rejected.");
        res.sendStatus(400);
        return;
    }

    const foundUser = await findUser(username);

    if (!foundUser) {
        console.log("Rejected.");
        res.status(404).json({ message: 'Cannot logout. There was no user found with the given credentials' });
        return;
    }

    if (!(await checkUserRefreshExists(foundUser["_id"], refreshToken))) {
        console.log("Rejected.");
        res.status(400).json({
            message: "This user is already logged out."
        });
        return;
    }

    const response = await findAndRemoveRefreshTokensByUserId(foundUser["_id"]);

    if (!response) {
        const message = "There was an issue logging out.";
        console.warn(message);
        res.status(500).json({
            message
        });
    } else {
        console.log("Destruction successful.")
        res.json({
            message: "Logout successful."
        });
    }
};
