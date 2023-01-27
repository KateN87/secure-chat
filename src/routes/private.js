import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/', (req, res) => {
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
        } catch (error) {
            res.sendStatus(401);
            return;
        }
        res.status(200).send({ userName: decoded.userName });
    } else {
        res.sendStatus(401);
    }
});

export default router;
