import { changeUserName } from './script.js';
import { state } from './globalVar.js';// globalVar from './globalVar.js';

async function signUpUser(userName, password) {
    const user = {
        userName,
        password,
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
            state.loggedInUser = await response.json();

            await loginUser(userName, password);

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

async function loginUser(userName, password) {
    const user = {
        userName,
        password,
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
            const user = await response.json();

            localStorage.setItem(state.JWT_KEY, user.token);

            await changeUserName(user.userName);
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
