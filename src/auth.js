import jwt from 'jsonwebtoken';
import { db } from './database.js';
import bcrypt from 'bcryptjs'

function authenticateUser(userName, password) {
    console.log('BACK authenticateUser() userData', db.data.userData);
    let match = db.data.userData.find(
        (user) => user.userName === userName)
    
    if(!match){
        return false;
    } else {
        let correctPassword = bcrypt.compareSync(password, match.password)
			if( correctPassword ) {
				return true;
			} 
    }
}

/* let match = users.find(user => user.username == username)
		if( !match ) {
			console.log('> Wrong username\n')
		} else {
			let correctPassword = bcrypt.compareSync(password, match.password)
			if( correctPassword ) {
				console.log('> Welcome user!')
			} else {
				console.log('> Password does not match.')
			} */

function createToken(userName) {
    const user = { userName: userName };
    const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' });
    user.token = token;
    console.log('createToken', user);
    return user;
}


export { createToken, authenticateUser};
