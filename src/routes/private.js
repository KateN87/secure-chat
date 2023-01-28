import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../database.js';

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

router.delete('/:id', (req, res) => {
    const channelName = req.body.name;
    const id = Number(req.params.id);

    /* const { userName } = req.body; */
    const maybeChannel = db.data.channelData.find(
        (channel) => channelName === channel.name
    );
    console.log('BACK maybeChannel: ', maybeChannel);
    /*     const maybeMessage = maybeChannel.messages;

    const maybeMessageIndex = maybeChannel.message;
    const messageIndex = spoilerData.findIndex((spoiler) => id === spoiler.id); */

    /*     if (spoilerIndex === -1) {
        res.status(404).send("Not found");
    } else {
        spoilerData.splice(spoilerIndex, 1);
        res.status(200).send(spoilerData);
    } */
    res.send(maybeChannel);
});
export default router;
