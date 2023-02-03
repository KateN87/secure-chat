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

const checkAuth = (req, res, next) => {
    let token = req.body.token || req.query.token;

    if (!token) {
        let x = req.headers['authorization'];

        if (x === undefined) {
            res.sendStatus(401);
            return;
        }
        token = x.substring(7);
    }

    if (token) {
        try {
            jwt.verify(token, process.env.SECRET);
        } catch (error) {
            console.log('Catch! Felaktig token!');
            res.sendStatus(401);
            return;
        }
        next();
    } else {
        ('No token! This shows');
        res.sendStatus(401);
    }
};

export { createToken, authenticateUser, checkAuth };
