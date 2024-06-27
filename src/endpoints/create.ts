
import { Request, Response } from 'express';
import {addNewUser} from "../persist/actions";
import {UserTemplate} from "../types/UserTemplate";

export const newUser = (req: Request, res: Response) => {
    console.log("\nCreate request received.");

    //TODO stop multiple users with same credentials

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
        console.log("Input config error in the create request.")
        res.status(400).json("Input config error.");
        return;
    }

    addNewUser(newUser)
        .then((resp) => res.status(resp.status).json({message: resp.message}))
        .catch((error) => res.status(400).json({message: error.message}));
}