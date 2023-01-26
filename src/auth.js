import jwt from 'jsonwebtoken';
import { userData } from './database.js';

function authenticateUser(userName, password) {
    console.log('BACK authenticateUser() userData', userData);

    const found = userData.find(
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
