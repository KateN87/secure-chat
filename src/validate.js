import { db } from './database.js';

function validateSignUp(name, password) {
    if (name === '' || password === '') {
        return false;
    }

    const maybeName = db.data.userData.find((user) => name === user.userName);

    if (maybeName) {
        return false;
    }

    return true;
}

function validateNewChannel(name) {
    if (name === '') {
        return false;
    }

    const maybeChannel = db.data.channelData.find(
        (channel) => channel === channel.name
    );

    if (maybeChannel) {
        return false;
    }

    return true;
}

export { validateSignUp, validateNewChannel };
