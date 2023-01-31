import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { db } from '../database.js';
import { validateNewChannel } from '../validate.js';
import { createTimeStamp } from './public.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/', (req, res) => {
    let token = req.headers['authorization'].substring(7);

    let decoded = jwt.verify(token, process.env.SECRET);

    res.status(200).send({ userName: decoded.userName });
});

router.delete('/:id', async (req, res) => {
    const channelName = req.body.name;
    const user = req.body.user;
    const id = Number(req.params.id);

    const maybeChannel = db.data.channelData.find(
        (channel) => channelName === channel.name
    );
    if (maybeChannel === undefined) {
        res.status(400).send('can not find channel');
        return;
    }
    console.log('Rad 55');
    const maybeMessage = maybeChannel.messages;
    if (maybeMessage === undefined) {
        res.status(400).send('can not find message');
        return;
    }
    console.log('Rad 60');
    const messageIndex = maybeMessage.findIndex((message) => id === message.id);
    if (messageIndex === -1) {
        res.status(400).send('Can not find id');
        return;
    }
    if (maybeMessage[messageIndex].userName === user) {
        console.log('if-sats:', maybeMessage[messageIndex].userName);
        maybeMessage[messageIndex] = { deleted: true };
        db.write();
        res.status(200).send(maybeChannel);
    } else {
        res.sendStatus(401);
        return;
    }
});

router.put('/:id', (req, res) => {
    const channelName = req.body.name;
    const newMessage = req.body.message;
    const user = req.body.user;
    const id = Number(req.params.id);

    /* const { userName } = req.body; */
    const maybeChannel = db.data.channelData.find(
        (channel) => channelName === channel.name
    );
    if (maybeChannel === undefined) {
        res.status(400).send('can not find channel');
    }
    const maybeMessage = maybeChannel.messages;
    if (maybeMessage === undefined) {
        res.status(400).send('can not find message');
    }
    const messageIndex = maybeMessage.findIndex((message) => id === message.id);
    if (messageIndex !== -1) {
        let thisMessage = maybeMessage[messageIndex];

        if (thisMessage.userName === user) {
            thisMessage.timeEdited = createTimeStamp();
            thisMessage.message = newMessage;
            /* delete thisMessage.timeCreated; */

            db.write();
            res.sendStatus(200);
        }
    } else {
        res.status(400).send('Can not find id');
    }
});

router.post('/', (req, res) => {
    let name = req.body.name;
    let status = req.body.private;

    let channelValidated = validateNewChannel(name);
    if (channelValidated) {
        let newChannel = {
            name,
            messages: [],
            private: status,
        };

        db.data.channelData.push(newChannel);
        db.write();
        res.status(200).send(newChannel);
    } else {
        res.sendStatus(400);
    }
});

export default router;
