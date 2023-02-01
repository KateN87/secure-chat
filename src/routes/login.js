import express from 'express';
import { authenticateUser, createToken } from '../auth.js';
import { validateSignUp } from '../validate.js';
import bcrypt from 'bcryptjs';
import { db } from '../database.js';

const router = express.Router();
const salt = bcrypt.genSaltSync(8);

router.post('/', (req, res) => {
    const { userName, password } = req.body;
    if (authenticateUser(userName, password)) {
        const userToken = createToken(userName);
        res.status(200).send(userToken);
    } else {
        res.sendStatus(401);
    }
});

/* app.post('/login', (req, res) => {
    //

    const { name, password } = req.body; //Plockar ut anv login-info
    if (authenticateUser(name, password)) {
        //Kollar om användaren
        const userToken = createToken(name);
        res.status(200).send(userToken);
    } else {
        res.sendStatus(401);
        return;
    }
}); */

router.post('/create', (req, res) => {
    const { userName, password } = req.body;
    if (validateSignUp(userName, password)) {
        let hashedPassword = bcrypt.hashSync(password, salt);
        let newUser = { userName, password: hashedPassword };

        db.data.userData.push(newUser);
        db.write();

        res.status(200).send(newUser);
    } else {
        res.sendStatus(400);
    }
});

export default router;
