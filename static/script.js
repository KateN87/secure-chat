import {
    createChannelElements,
    createInfoElements,
    createMessageElements,
} from './create-elements.js';
import { checkAuth } from './auth.js';
import { signUpUser, loginUser } from './loginetc.js';

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
const inputMessage = document.querySelector('#inputMessage');
const btnSendMessage = document.querySelector('#send-message');
/* const inputUserName = document.querySelector('#inputUserName');
const inputPassword = document.querySelector('#inputPassword'); */

const JWT_KEY = 'secureChat-jwt';

let isLoggedIn = false;

let loggedInUser = { userName: '' };

let activeChannel = '';

checkForLoggedin();
getChannelNames();

async function changeUserName(name) {
    loggedInUser = { userName: `${name}` };
}

btnSendMessage.addEventListener('click', () => {
    sendNewMessage(activeChannel);
});

async function sendNewMessage(channelName) {
    console.log('this is the channelName', channelName);
    const newMessage = {
        message: inputMessage.value,
        userName: loggedInUser.userName,
    };
    const options = {
        method: 'POST',
        body: JSON.stringify(newMessage),
        headers: {
            'Content-type': 'application/json',
        },
    };

    try {
        const response = await fetch(
            '/api/public/channels/' + `${channelName}`,
            options
        );
        if (response.status === 200) {
            let channel = await response.json();
            console.log('This is channel', channel);
            await getMessages(channel.name);
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

async function checkForLoggedin() {
    let maybeLoggedIn = await checkAuth();
    if (maybeLoggedIn) {
        isLoggedIn = true;
        updateLoggedUI();
        return;
    }
    updateLoggedUI();
    loggedInUser = { userName: 'Guest' };
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
            names.innerText = 'Guest';
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
    } else {
        btnShowSignUp.innerText = 'Close';
        inputPassword.value = '';
        inputUserName.value = '';
    }
});

btnLogin.addEventListener('click', async () => {
    let userName = inputUserName.value;
    let password = inputPassword.value;
    let maybeLoggedIn = await loginUser(loggedInUser, userName, password);
    if (maybeLoggedIn) {
        isLoggedIn = true;
        updateLoggedUI();
    } else {
        isLoggedIn = false;
        errorLogin.classList.remove('invisible');
    }
});

btnLogout.addEventListener('click', () => {
    isLoggedIn = false;
    loggedInUser = { userName: 'Guest' };
    localStorage.removeItem(JWT_KEY);
    updateLoggedUI();
});

btnSignUp.addEventListener('click', async () => {
    let userName = inputUserName.value;
    let password = inputPassword.value;
    let maybeSignedUp = await signUpUser(loggedInUser, userName, password);
    if (maybeSignedUp) {
        checkForLoggedin();
    } else {
        inputPassword.value = '';
        inputUserName.value = '';
        errorSignUp.classList.remove('invisible');
    }
});

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
        let divInfo = createInfoElements(loggedInUser, message);
        let messagesChannels = createMessageElements(message);

        divMain.appendChild(divInfo);
        divMain.appendChild(messagesChannels);
        chatContainer.appendChild(divMain);
    }
}

export { getMessages, isLoggedIn, changeUserName, JWT_KEY };
