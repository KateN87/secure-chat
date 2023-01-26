import express from 'express';
import { db } from '../database.js';

const router = express.Router();

let idCount = 2;

router.get('/channels', (req, res) => {
    let channelsArray = [];
    db.data.channelData.forEach((elementName) => {
        let eachChannel = {
            name: elementName.name,
            private: elementName.private,
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
    const id = idCount++;

    const maybeChannel = db.data.channelData.find(
        (channel) => channelName === channel.name
    );
    // channel: { name, messages, private }
    if (maybeChannel) {
        let newMessage = {
            id,
            message,
            timeCreated: createTimeStamp(),
            userName,
        };

        maybeChannel.messages.push(newMessage);
        db.write();
        /*     console.log(maybeChannel); */

        res.send('test');
    }
});

function createTimeStamp() {
    let now = new Date();
    let plainText = now.toDateString();
    let timeDate = `${plainText} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    return timeDate;
}

export default router;

/* date.getDate() + ':' date.getDay() + ':'

Date.prototype.getDate()
Returns the day of the month (1 – 31) for the specified date according to local time.

Date.prototype.getDay()
Returns the day of the week (0 – 6) for the specified date according to local time.

Date.prototype.getFullYear()
 */
