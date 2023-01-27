import jwt from 'jsonwebtoken';
import { db } from './database.js';
import bcrypt from 'bcryptjs';

function authenticateUser(userName, password) {
    /* console.log('BACK authenticateUser() userData', db.data.userData); */
    let match = db.data.userData.find((user) => user.userName === userName);

    if (!match) {
        return false;
    } else {
        let correctPassword = bcrypt.compareSync(password, match.password);
        console.log('BACK AuthenticateUser match.password', match.password);
        if (correctPassword) {
            console.log(
                'BACK AuthenticateUser correctPassword',
                correctPassword
            );
            return true;
        }
    }
}

function createToken(userName) {
    const user = { userName: userName };
    const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' });
    user.token = token;
    console.log('createToken', user);
    return user;
}

export { createToken, authenticateUser };
