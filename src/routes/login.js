import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { authenticateUser, createToken } from '../auth.js';
import bcrypt from 'bcryptjs';
import { db } from '../database.js';

const router = express.Router();
const salt = bcrypt.genSaltSync(8);

router.post('/', (req, res) => {
    const { userName, password } = req.body;
    /* console.log('BACK login req.body', req.body); */
    if (authenticateUser(userName, password)) {
        const userToken = createToken(userName);
        res.status(200).send(userToken);
    } else {
        /*         console.log('Unauthorized user, req.body: ', req.body); */
        res.sendStatus(401);
    }
});

router.post('/create', (req, res) => {
    const { userName, password } = req.body;
    let hashedPassword = bcrypt.hashSync(password, salt);
    let newUser = { userName, password: hashedPassword };

    db.data.userData.push(newUser);
    db.write();

    res.status(200).send(newUser);
});

export default router;
