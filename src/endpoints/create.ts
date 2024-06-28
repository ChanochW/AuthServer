
import { Request, Response } from 'express';
import {addNewUser, userAlreadyTaken} from "../persist/actions";
import {UserTemplate} from "../types/UserTemplate";

export const newUser = async (req: Request, res: Response) => {
    console.log("\nCreate request received.");

    if (await userAlreadyTaken(req.body.username)) {
        res.status(409).json({message: "Username already exists."});
        return;
    }

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
        .catch((error) => res.status(500).json({message: error.message}));
}