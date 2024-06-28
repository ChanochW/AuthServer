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

        const result = (await db.collection('Users').insertOne(newUser)).acknowledged;

        if (!result) {
            const resp = {status: 500, message: "There was an issue adding the new user."};
            console.warn(resp.message);
            return resp;
        }

        const resp = {status: 201, message: "User Added Successfully!"};
        console.log(resp.message);
        return resp;
    } catch (error) {
        console.error('Error while creating user: ', error);
        return {status: 500, message: "An error occurred while creating the user."};
    }
};

export const userAlreadyTaken = async (username: string) => {
    const db = await connectDB();
    const existingUser = await db.collection('Users').findOne({ username });
    if (existingUser) {
        console.log("Username already taken.")
        return true;
    } else {
        return false;
    }
}

export const deleteUser = async (userId: string): Promise<ResObj> => {
    try {
        const objId = new ObjectId(userId);

        const db = await connectDB();

        const deletedUser = await db.collection('Users').findOneAndDelete({_id: objId.id});
        console.log("Deleted user:");
        console.log(deletedUser);
        console.log("\n");

        return {status: 200, message: "User Removed Successfully!"};
    } catch (error) {
        console.error('Error while creating user:', error);
        return {status: 500, message: "An error occurred while creating the user."};
    }
};

export const findUser = async (username: string) => {
    try {
        const db = await connectDB();

        return await db.collection('Users').findOne({username});
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const addNewRefreshToken = async (userId: ObjectId, refreshToken: string) => {
    try {
        const db = await connectDB();

        return (await db.collection('RefreshTokens').insertOne({
            userId: userId,
            token: refreshToken,
            createdAt: new Date(),
        })).acknowledged;
    } catch (e) {
        console.log(e);
        return false;
    }

}

export const findAndRemoveRefreshTokensByUserId = async (id: ObjectId) => {
    try {
        const db = await connectDB();
        return (await db.collection('RefreshTokens').deleteMany({userId: id})).acknowledged;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const checkForRefresh = async (token: string) => {
    try {
        const db = await connectDB();
        return !!(await db.collection('RefreshTokens').findOne({token}));
    } catch (e) {
        console.log(e);
        return false;
    }
}

export const checkUserRefreshExists = async (userId: ObjectId, token: string) => {
    try {
        const db = await connectDB();

        return !!(await db.collection('RefreshTokens').findOne({userId, token}));
    } catch (e) {
        console.log(e);
        return false;
    }
}

export type ResObj = {status: number, message: string}