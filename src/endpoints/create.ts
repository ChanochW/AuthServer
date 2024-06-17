
import { Request, Response } from 'express';
import {addNewUser} from "../persist/actions";
import {getKeys, UserTemplate} from "../types/UserTemplate";
import {NameTemplate} from "../types/NameTemplate";
export const newUser = (req: Request, res: Response) => {
    let inputConfigError = false;

    const newUser: UserTemplate = {
        email: req.body.email,
        name: req.body.name,
        otherAddresses: req.body.otherAddresses,
        passwordHash: req.body.password ?? (inputConfigError = true),
        paymentMethods: req.body.paymentMethods,
        primaryAddress: req.body.primaryAddress,
        role: req.body.role,
        username: req.body.username ?? (inputConfigError = true)
    }

    if (inputConfigError) {
        res.status(400).json("Input config error.");
        return;
    }

    addNewUser(newUser)
        .then((resp) => res.status(resp.status).json(resp.message))
        .catch((error) => res.status(400).json(error.message));
}