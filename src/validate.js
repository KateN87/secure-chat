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
    console.log('BACK validateChannel name: ', name);
    if (name === '') {
        console.log('BACK validateChannel name === "":', name === '');
        return false;
    }

    const maybeChannel = db.data.channelData.find(
        (channel) => channel.name === name
    );

    if (maybeChannel === undefined) {
        return true;
    } else {
        return false
    }
}

export { validateSignUp, validateNewChannel };
