import { JWT_KEY, changeUserName } from './script.js';

async function signUpUser(loggedInUser, userName, password) {
    const user = {
        userName: userName,
        password: password,
    };
    const options = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json',
        },
    };

    try {
        const response = await fetch('/api/login/create', options);
        if (response.status === 200) {
            loggedInUser = await response.json();

            await loginUser(loggedInUser, loggedInUser.userName, user.password);

            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(
            'Could not POST to server. Error Message: ' + error.message
        );
        return;
    }
}

async function loginUser(name, sendName, password) {
    const user = {
        userName: sendName,
        password: password,
    };
    const options = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json',
        },
    };

    try {
        const response = await fetch('/api/login/', options);
        if (response.status === 200) {
            name = await response.json();

            localStorage.setItem(JWT_KEY, name.token);

            await changeUserName(name.userName);
            return true;
        } else {
            console.log('Login failed : ' + response.status);
            return false;
        }
    } catch (error) {
        console.log(
            'Could not POST to server. Error Messagge: ' + error.message
        );
        return;
    }
}

export { signUpUser, loginUser };
