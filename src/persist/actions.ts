import {UserTemplate} from "../types/UserTemplate";
import {UserModel} from "./db/models/User";
import {connectDB} from "./db/connection";
import * as bcrypt from "bcrypt";
import {ObjectId} from 'mongodb';

export const addNewUser = async (user: UserTemplate): Promise<ResObj> => {
    try {
        const db = await connectDB();

        user = {
            ...user,
            passwordHash: await bcrypt.hash(user.passwordHash, 10)
        }

        const newUser = new UserModel(user);

        await db.collection('Users').insertOne(newUser);

        //const insertedUser = await db.collection('users').findOne({ _id: result.insertedId });
        //response.status(201).json(insertedUser);
        return {status: 201, message: "User Added Successfully!"};
    } catch (error) {
        console.error('Error while creating user:', error);
        return {status: 500, message: "An error occurred while creating the user."};
    }
};

export const deleteUser = async (userId: string): Promise<ResObj> => {
    try {
        const objId = new ObjectId(userId);

        const db = await connectDB();

        const insertedUser = await db.collection('Users').findOneAndDelete({_id: objId.id});
        return {status: 201, message: "User Removed Successfully!"};
    } catch (error) {
        console.error('Error while creating user:', error);
        return {status: 500, message: "An error occurred while creating the user."};
    }
};

export type ResObj = {status: number, message: string}