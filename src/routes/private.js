import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/', (req, res) => {
/*     console.log('BACK private.js /') */
    let token = req.body.token || req.query.token;

    if (!token) {
        let x = req.headers['authorization'];

        if (x === undefined) {
            res.sendStatus(401);
            return;
        }
        token = x.substring(7);
    }

    if (token) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.SECRET);
            console.log('decoded', decoded);
        } catch (error) {
/*             console.log('token stämmer ej med secret');
            console.log('decoded', decoded); */
            res.sendStatus(401);
            return;
        }
        res.status(200).send({ userName: decoded.userName });
    } else {
/*         console.log('Ingen token'); */
        res.sendStatus(401);
    }
});

export default router;
