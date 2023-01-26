import jwt from 'jsonwebtoken';
import { db } from './database.js';

function authenticateUser(userName, password) {
    console.log('BACK authenticateUser() userData', db.data.userData);

    const found = db.data.userData.find(
        (user) => user.userName === userName && user.password === password
    );

    return Boolean(found);
}

function createToken(userName) {
    const user = { userName: userName };
    const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' });
    user.token = token;
    console.log('createToken', user);
    return user;
}


export { createToken, authenticateUser};
