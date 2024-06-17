import express from 'express';
import { login, refresh } from './endpoints/validate';
import { destroy } from './endpoints/destroy';
import { newUser } from './endpoints/create';
import { config } from 'dotenv';
import {UserTemplate} from "./types/UserTemplate";
import {RoleTemplate} from "./types/RoleTemplate";
import {addNewUser} from "./persist/actions";

config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

export let refreshTokens: string[] = [];


app.post('/create', newUser);
app.post('/login', login);
app.post('/token', refresh);
app.delete('/logout', destroy);
app.get("/testing", (req, res) => {
    const newUser: UserTemplate = {
        email: "email@email.com",
        name: {
            prefix: "Mr.",
            firstName: "Senior",
            middleName: "Master",
            lastName: "Tester",
            suffix: "Sr."
        },
        otherAddresses: [],
        passwordHash: "123",
        paymentMethods: [],
        primaryAddress: {
            streetAddress: "7531 150th St.",
            city: "Flushing",
            state: "NY",
            zip: 11367
        },
        role: RoleTemplate.SysAdmin,
        username: "email@email.com"
    };
    addNewUser(newUser)
        .then((resp) => console.log(resp))
        .catch((error) => console.log(error));
    res.json(process.env.URI)
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
