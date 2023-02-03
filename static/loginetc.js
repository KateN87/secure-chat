import { state, inputs, forms } from './globalVar.js';
import { updateLoggedUI, checkForLoggedin } from './script.js';
import { showWrong } from './validation.js';

async function tryLogin() {
    let maybeLoggedIn = await loginUser();
    if (!maybeLoggedIn) {
        forms.errorLogin.classList.remove('invisible');
    } else {
        localStorage.setItem(state.JWT_KEY, maybeLoggedIn.token);
        state.loggedInUser = { userName: `${maybeLoggedIn.userName}` };
        state.isLoggedIn = true;
        forms.errorLogin.classList.add('invisible');
        updateLoggedUI();
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
        showWrong();
        console.log(
            'Could not POST to server. Error Messagge: ' + error.message
        );
        return;
    }
}

async function trySignUp() {
    let maybeSignedUp = await signUpUser();
    if (maybeSignedUp) {
        let maybeLoggedIn = await loginUser();
        localStorage.setItem(state.JWT_KEY, maybeLoggedIn.token);
        state.loggedInUser = { userName: `${maybeLoggedIn.userName}` };
        state.isLoggedIn = true;
        forms.errorSignUp.classList.add('invisible');
        updateLoggedUI();
        checkForLoggedin();
    } else {
        inputs.inputPassword.value = '';
        inputs.inputUserName.value = '';
        forms.errorSignUp.classList.remove('invisible');
    }
}

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
        showWrong();
        console.log(
            'Could not POST to server. Error Message: ' + error.message
        );
        return;
    }
}

export { signUpUser, loginUser, tryLogin, trySignUp };
