import jwt from 'jsonwebtoken';
import { db } from './database.js';
import bcrypt from 'bcryptjs';

function authenticateUser(userName, password) {
    let match = db.data.userData.find((user) => user.userName === userName);

    if (!match) {
        return false;
    } else {
        let correctPassword = bcrypt.compareSync(password, match.password);
        if (correctPassword) {
            return true;
        }
    }
}

function createToken(userName) {
    let user = { userName: userName };
    const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' });
    user.token = token;
    return user;
}

export { createToken, authenticateUser };
