import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../database.js';
import { validateNewChannel } from '../validate.js';
import { createTimeStamp } from './public.js';

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
        console.log('BACK user', user);
        if (maybeMessage[messageIndex].userName === user) {
            maybeMessage[messageIndex] = { deleted: true };
            /* maybeMessage.splice(messageIndex, 1); */
            db.write();
            res.status(200).send(maybeChannel);
            /* res.send('yesss'); */
        }
    } else {
        res.status(400).send('Can not find id');
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
            delete thisMessage.timeCreated;

            db.write();
            res.sendStatus(200);
        }
    } else {
        res.status(400).send('Can not find id');
    }
});

router.post('/', (req, res) => {
    /* Behöver name, messages och private */
    let name = req.body.name;
    let status = req.body.private;

    /* const { name, public } = req.body; */
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
