import express from 'express';
import { db } from '../database.js';

const router = express.Router();

router.get('/channels', (req, res) => {
    let channelsArray = [];
    db.data.channelData.forEach((element) => {
        let eachChannel = {
            name: element.name,
            private: element.private,
        };

        channelsArray.push(eachChannel);
    });

    res.send(channelsArray);
});

router.get('/channels/:name/messages', (req, res) => {
    const channelName = req.params.name;
    const maybeChannel = db.data.channelData.find(
        (channel) => channelName === channel.name
    );
    if (maybeChannel) {
        res.send(maybeChannel.messages);
    } else {
        res.sendStatus(404);
    }
});

router.post('/channels/:name', (req, res) => {
    const channelName = req.params.name;
    const { message, userName } = req.body;

    const maybeChannel = db.data.channelData.find(
        (channel) => channelName === channel.name
    );
    const id = maybeChannel.messages.length + 1;

    if (maybeChannel) {
        let newMessage = {
            id,
            message,
            timeCreated: createTimeStamp(),
            userName,
        };

        maybeChannel.messages.push(newMessage);
        db.write();
        res.status(200).send(maybeChannel);
    } else {
        res.sendStatus(400);
    }
});

export function createTimeStamp() {
    let now = new Date();
    let plainText = now.toDateString();
    let timeDate = `${plainText} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    return timeDate;
}

export default router;
