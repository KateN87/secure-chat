//ToDo:
//fixa i createMessageElements() så iconerna endast skapas på de meddelanden där user stämmer överens med inloggad
import {
    createChannelElements,
    createInfoElements,
    createMessageElements,
} from './create-elements.js';
import { checkAuth } from './auth.js';

const channelsContainer = document.querySelector('#channelsContainer');
const chatContainer = document.querySelector('#chatContainer');
const btnShowLogin = document.querySelector('#btnshowLogin');
const btnShowSignUp = document.querySelector('#btnshowSignUp');
const userForm = document.querySelector('.user-form');
const btnLogin = document.querySelector('#btnLogin');
const btnSignUp = document.querySelector('#btnSignUp');
const btnLogout = document.querySelector('#btnLogout');
const errorLogin = document.querySelector('#error-login');
const errorSignUp = document.querySelector('#error-signup');
const nameOutput = document.querySelectorAll('.name-output');
const inputMessage = document.querySelector('#input-message');
const btnSendMessage = document.querySelector('#send-message');

const JWT_KEY = 'secureChat-jwt';

let isLoggedIn = false;

let loggedInUser = { userName: '' };

let activeChannel = '';

checkForLoggedin();
getChannelNames();

function changeUserName(name) {
    loggedInUser = name;
}

btnSendMessage.addEventListener('click', () => {
    sendNewMessage(activeChannel);
});

async function sendNewMessage(channelName) {
    console.log('this is the channelName', channelName);
}

async function checkForLoggedin() {
    let maybeLoggedIn = await checkAuth();
    if (maybeLoggedIn) {
        isLoggedIn = true;
        updateLoggedUI();
        return;
    }
}

function updateLoggedUI() {
    if (isLoggedIn) {
        for (const names of nameOutput) {
            names.innerText = `${loggedInUser.userName}`;
        }
        userForm.classList.add('invisible');
        btnShowLogin.classList.add('invisible');
        btnShowSignUp.classList.add('invisible');
        btnLogout.classList.remove('invisible');
    } else {
        for (const names of nameOutput) {
            names.innerText = '';
        }
        btnLogout.classList.add('invisible');
        btnShowLogin.classList.remove('invisible');
        btnShowSignUp.classList.remove('invisible');
        userForm.classList.add('invisible');
        errorLogin.classList.add('invisible');
        errorSignUp.classList.add('invisible');

        btnShowLogin.innerText = 'Log in';
        btnShowSignUp.innerText = 'Sign up';
    }
}

btnShowLogin.addEventListener('click', () => {
    userForm.classList.toggle('invisible');
    btnLogin.classList.remove('invisible');
    btnShowSignUp.classList.toggle('invisible');
    errorLogin.classList.add('invisible');
    if (userForm.classList.contains('invisible')) {
        btnShowLogin.innerText = 'Log in';
    } else {
        inputPassword.value = '';
        inputUserName.value = '';
        btnShowLogin.innerText = 'Close';
    }
});

btnShowSignUp.addEventListener('click', () => {
    userForm.classList.toggle('invisible');
    btnLogin.classList.add('invisible');
    btnSignUp.classList.toggle('invisible');
    btnShowLogin.classList.toggle('invisible');
    errorSignUp.classList.add('invisible');
    if (userForm.classList.contains('invisible')) {
        btnShowSignUp.innerText = 'Sign up';
        inputPassword.innerText = '';
        inputUserName.innerText = '';
    } else {
        btnShowSignUp.innerText = 'Close';
    }
});

btnLogin.addEventListener('click', () => {
    let userName = inputUserName.value;
    let password = inputPassword.value;

    loginUser(userName, password);
});

btnLogout.addEventListener('click', () => {
    isLoggedIn = false;
    localStorage.removeItem(JWT_KEY);
    updateLoggedUI();
});

btnSignUp.addEventListener('click', signUpUser);

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
            loggedInUser = await response.json();

            loginUser(loggedInUser.userName, inputPassword.value);
        } else {
            errorSignUp.classList.remove('invisible');
        }
    } catch (error) {
        console.log(
            'Could not POST to server. Error Message: ' + error.message
        );
        return;
    }
    inputUserName.value = '';
    inputPassword.value = '';
}

async function loginUser(userName, password) {
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
        const response = await fetch('/api/login/', options);
        if (response.status === 200) {
            console.log('Login successful!');
            loggedInUser = await response.json();
            console.log(
                'FRONT loginUser() loggedInUser.userName: ',
                loggedInUser.userName
            );

            localStorage.setItem(JWT_KEY, loggedInUser.token);

            isLoggedIn = true;
            loggedInUser.userName = loggedInUser.userName;

            updateLoggedUI();
        } else {
            isLoggedIn = false;
            errorLogin.classList.remove('invisible');
            console.log('Login failed : ' + response.status);
        }
    } catch (error) {
        console.log(
            'Could not POST to server. Error Messagge: ' + error.message
        );
        return;
    }
    inputUserName.value = '';
    inputPassword.value = '';
}

async function getChannelNames() {
    channelsContainer.innerHTML = '';
    let nameArray = [];
    try {
        const response = await fetch('/api/public/channels', {
            method: 'GET',
        });
        nameArray = await response.json();
        if (response.status !== 200) {
            console.log(
                'Could not connect to server. Status: ' + response.status
            );

            return;
        }
    } catch (error) {
        console.log(
            'Could not GET data from the server. Error message: ' +
                error.message
        );
        return;
    }

    for (const name of nameArray) {
        createChannelElements(name);
    }
}

async function getMessages(name) {
    activeChannel = name.name;
    chatContainer.innerHTML = '';
    let messageArray = [];
    try {
        const response = await fetch(
            `/api/public/channels/${name.name}/messages`,
            {
                method: 'GET',
            }
        );
        messageArray = await response.json();
        if (response.status !== 200) {
            console.log(
                'Could not connect to server. Status: ' + response.status
            );

            return;
        }
    } catch (error) {
        console.log(
            'Could not GET data from the server. Error message: ' +
                error.message
        );
        return;
    }

    for (const message of messageArray) {
        const divMain = document.createElement('div');
        let divInfo = createInfoElements(message);
        let messagesChannels = createMessageElements(message);

        divMain.appendChild(divInfo);
        divMain.appendChild(messagesChannels);
        chatContainer.appendChild(divMain);
    }
}

export { getMessages, isLoggedIn, changeUserName, JWT_KEY };
