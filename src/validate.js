import { db } from './database.js';

function validateSignUp(name, password) {
    if (name === '' || password === '') {
        return false;
    }

    const maybeName = db.data.userData.find((user) => name === user.userName);
    console.log('maybeName', maybeName);

    if (maybeName) {
        console.log(maybeName);
        return false;
    }

    return true;
}

export { validateSignUp };
