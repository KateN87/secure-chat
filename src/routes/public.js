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
    /* const id = channelName.messages.length + 1; */
    console.log('channelName', channelName);

    const maybeChannel = db.data.channelData.find(
        (channel) => channelName === channel.name
    );
    const id = maybeChannel.messages.length + 1;
    console.log(
        'BACK maybeChannel.messages.length: ',
        maybeChannel.messages.length
    );
    console.log('BACK id: ', id);
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

/*
function validateMessage(maybeMessage) {
	if( !maybeMessage.userAlias ) return false
	if( !maybeMessage.message ) return false
	// if( !maybeMessage.userAlias ) return false
	// if( !maybeMessage.userAlias ) return false
	return true
}
*/

function createTimeStamp() {
    let now = new Date();
    let plainText = now.toDateString();
    let timeDate = `${plainText} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    return timeDate;
}

export default router;
