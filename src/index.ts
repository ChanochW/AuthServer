import express from 'express';
import {generateAccessToken, login, refresh} from './endpoints/validate';
import { destroy } from './endpoints/destroy';
import { newUser } from './endpoints/create';
import { config } from 'dotenv';
import {authenticationMiddleware} from "./endpoints/middleware";

config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.post('/create', newUser);
app.post('/login', login);
app.post('/token', refresh);
app.delete('/logout', destroy);
app.get("/testing", authenticationMiddleware, async (req, res) => {
    const token1 = await generateAccessToken({name: "bob"});
    const token2 = await generateAccessToken({name: "bob"});
    const token3 = await generateAccessToken({name: "bob"});
    const token4 = await generateAccessToken({name: "bob"});
    const token5 = await generateAccessToken({name: "bob"});

    console.log("Token 1:", token1);
    console.log("Token 2:", token2);
    console.log("Token 3:", token3);
    console.log("Token 4:", token4);
    console.log("Token 5:", token5);

    res.json({
        tokens: [token1, token2, token3, token4, token5],
        secret: "Something really important!"
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
