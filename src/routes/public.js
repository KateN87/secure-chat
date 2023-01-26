import express from 'express';
import { channelData } from '../database.js';

const router = express.Router();

let idCount = 2;

router.get('/channels', (req, res) => {
    let channelsArray = [];
    channelData.forEach((elementName) => {
        let eachChannel = {
            name: elementName.name,
            private: elementName.private,
        };

        channelsArray.push(eachChannel);
    });

    res.send(channelsArray);
});

router.get('/channels/:name/messages', (req, res) => {
    //Ska jag ha channels/:name bara istället?
    const channelName = req.params.name;
    let messageArray = [];
    const maybeChannel = channelData.find(
        (channel) => channelName === channel.name
    );
    if (maybeChannel) {
        console.log('This is maybeChannel.messages', maybeChannel.messages);
        maybeChannel.messages.forEach((message) => {
            messageArray.push(message);
        });
    }

    console.log('This is messageArray', messageArray);
    res.send(messageArray);
});

router.post('/channels/:name', (req, res) => {
    const channelName = req.params.name;
    const { message, userName } = req.body;
    const id = idCount++;

/*     const maybeChannel = channelData.find(
        (channel) => channelName === channel.name
    ); */
    let newMessage = {
        id,
        message,
        timeCreated: createTimeStamp(),
        userName,
        isChanged: '',
        timeChanged: '',
        isDeleted: '',
        timeDeleted: '',
    };

    maybeChannel.messages.push(newMessage);
/*     console.log(maybeChannel); */

    res.send('test');
});

function createTimeStamp() {
    let now = new Date();
    return now.toISOString();
}

export default router;

/* date.getDate() + ':' date.getDay() + ':'

Date.prototype.getDate()
Returns the day of the month (1 – 31) for the specified date according to local time.

Date.prototype.getDay()
Returns the day of the week (0 – 6) for the specified date according to local time.

Date.prototype.getFullYear()
 */
