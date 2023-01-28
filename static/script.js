import {
    createChannelElements,
    createInfoElements,
    createMessageElements,
} from './create-elements.js';
import { checkAuth } from './auth.js';
import { signUpUser, loginUser } from './loginetc.js';
import * as elementName from './getDOM.js';
import * as globalVar from './globalVar.js';

const JWT_KEY = globalVar.JWT_KEY;

let isLoggedIn = globalVar.isLoggedIn;

let loggedInUser = globalVar.loggedInUser;

let activeChannel = globalVar.activeChannel;

checkForLoggedin();
getChannelNames();

async function changeUserName(name) {
    loggedInUser = { userName: `${name}` };
}

elementName.btnSendMessage.addEventListener('click', () => {
    sendNewMessage(activeChannel);
});

async function sendNewMessage(channelName) {
    console.log('this is the channelName', channelName);
    const newMessage = {
        message: elementName.inputMessage.value,
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
            await getMessages(channel);
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
        for (const names of elementName.nameOutput) {
            names.innerText = `${loggedInUser.userName}`;
        }
        elementName.userForm.classList.add('invisible');
        elementName.btnShowLogin.classList.add('invisible');
        elementName.btnShowSignUp.classList.add('invisible');
        elementName.btnLogout.classList.remove('invisible');
    } else {
        for (const names of elementName.nameOutput) {
            names.innerText = 'Guest';
        }
        activeChannel = '';
        elementName.chatContainer.innerHTML = '';
        elementName.btnLogout.classList.add('invisible');
        elementName.btnShowLogin.classList.remove('invisible');
        elementName.btnShowSignUp.classList.remove('invisible');
        elementName.userForm.classList.add('invisible');
        elementName.errorLogin.classList.add('invisible');
        elementName.errorSignUp.classList.add('invisible');

        elementName.btnShowLogin.innerText = 'Log in';
        elementName.btnShowSignUp.innerText = 'Sign up';
    }
}

elementName.btnShowLogin.addEventListener('click', () => {
    elementName.userForm.classList.toggle('invisible');
    elementName.btnLogin.classList.remove('invisible');
    elementName.btnShowSignUp.classList.toggle('invisible');
    elementName.errorLogin.classList.add('invisible');
    if (elementName.userForm.classList.contains('invisible')) {
        elementName.btnShowLogin.innerText = 'Log in';
    } else {
        elementName.inputPassword.value = '';
        elementName.inputUserName.value = '';
        elementName.btnShowLogin.innerText = 'Close';
    }
});

elementName.btnShowSignUp.addEventListener('click', () => {
    elementName.userForm.classList.toggle('invisible');
    elementName.btnLogin.classList.add('invisible');
    elementName.btnSignUp.classList.toggle('invisible');
    elementName.btnShowLogin.classList.toggle('invisible');
    elementName.errorSignUp.classList.add('invisible');
    if (elementName.userForm.classList.contains('invisible')) {
        elementName.btnShowSignUp.innerText = 'Sign up';
    } else {
        elementName.btnShowSignUp.innerText = 'Close';
        elementName.inputPassword.value = '';
        elementName.inputUserName.value = '';
    }
});

elementName.btnLogin.addEventListener('click', async () => {
    let userName = elementName.inputUserName.value;
    let password = elementName.inputPassword.value;
    let maybeLoggedIn = await loginUser(loggedInUser, userName, password);
    if (maybeLoggedIn) {
        isLoggedIn = true;
        updateLoggedUI();
    } else {
        isLoggedIn = false;
        elementName.errorLogin.classList.remove('invisible');
    }
});

elementName.btnLogout.addEventListener('click', () => {
    isLoggedIn = false;
    loggedInUser = { userName: 'Guest' };
    localStorage.removeItem(JWT_KEY);
    updateLoggedUI();
});

elementName.btnSignUp.addEventListener('click', async () => {
    let userName = inputUserName.value;
    let password = inputPassword.value;
    let maybeSignedUp = await signUpUser(loggedInUser, userName, password);
    if (maybeSignedUp) {
        checkForLoggedin();
    } else {
        elementName.inputPassword.value = '';
        elementName.inputUserName.value = '';
        elementName.errorSignUp.classList.remove('invisible');
    }
});

async function getChannelNames() {
    elementName.channelsContainer.innerHTML = '';
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
    elementName.chatContainer.innerHTML = '';
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
        if (!message.deleted) {
            let divInfo = createInfoElements(name, loggedInUser, message);
            divMain.appendChild(divInfo);
        }

        let messagesChannels = createMessageElements(message);

        divMain.appendChild(messagesChannels);
        elementName.chatContainer.appendChild(divMain);
    }
}

export { getMessages, isLoggedIn, changeUserName, JWT_KEY };
