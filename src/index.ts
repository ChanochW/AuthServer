import express from 'express';
import { login, refresh } from './validate';
import { destroy } from './destroy';
import { newUser } from './create';
import { config } from 'dotenv';

config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

export let refreshTokens: string[] = [];


app.post('/create', newUser);
app.post('/login', login);
app.post('/token', refresh);
app.delete('/logout', destroy);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
