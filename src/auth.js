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

    let match = db.data.userData.find((user) => user.userName === userName);

    match.token = token;
    db.write();
    return user;
}

const checkAuth = (req, res, next) => {
    let token = req.body.token || req.query.token;

    if (!token) {
        let x = req.headers['authorization'];

        if (x === undefined) {
            res.sendStatus(401);
        }
        token = x.substring(7);
    }

    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                console.log('BACK checkAuth when decoding: ', err.message);
                res.sendStatus(401);
            } else {
                next();
            }
        });
    } else {
        res.sendStatus(401);
    }
};

export { createToken, authenticateUser, checkAuth };
