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

export { validateSignUp };
