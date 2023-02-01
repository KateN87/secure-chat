import { state, inputs } from './globalVar.js'; // globalVar from './globalVar.js';

async function signUpUser() {
    const user = {
        userName: inputUserName.value,
        password: inputPassword.value,
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

async function loginUser() {
    const user = {
        userName: inputs.inputUserName.value,
        password: inputs.inputPassword.value,
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
            return user;
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
