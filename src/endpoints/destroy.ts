import { Request, Response } from 'express';
import {checkUserRefreshExists, findAndRemoveRefreshTokensByUserId, findUser} from "../persist/actions";

export const destroy = async (req: Request, res: Response) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }

    const foundUser = await findUser(req.body.username);

    if (!foundUser) {
        res.status(400).json({ message: 'Cannot logout. There was no user found with the given credentials' });
        return;
    }

    if (!(await checkUserRefreshExists(foundUser["_id"], refreshToken))) {
        res.status(400).json({
            message: "This user is already logged out."
        });
        return;
    }

    const response = await findAndRemoveRefreshTokensByUserId(foundUser["_id"]);

    if (!response) {
        res.status(500).json({
            message: "There was an issue logging out."
        });
    } else {
        res.json({
            message: "Logout successful."
        });
    }
};
