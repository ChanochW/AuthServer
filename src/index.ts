import express from 'express';
import {login, refresh} from './endpoints/validate';
import { destroy } from './endpoints/destroy';
import { newUser } from './endpoints/create';
import { config } from 'dotenv';
import {authenticationMiddleware} from "./endpoints/middleware";

config();

const app = express();
const port = process.env.PORT;

//TODO set up cors policy
//TODO set up throttling for requests
//TODO verify all the response codes.
//TODO explore options for file based logging

app.use(express.json());

app.post('/create', newUser);
app.post('/login', login);
app.post('/token', refresh);
app.delete('/logout', destroy);
app.get("/testing", authenticationMiddleware, async (req, res) => {
    console.log(req.body.username);
    console.log(req.body.login_access_level);
    res.json({
        secret: "Something really important!"
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
