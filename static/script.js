import {
    createChannelElements,
    createMessageElements,
} from './create-elements.js';
import { checkAuth } from './auth.js';
import { signUpUser, loginUser } from './loginetc.js';
import * as element from './getDOM.js';
import { createChannel } from './editRemove.js';
import * as globalVar from './globalVar.js';

let JWT_KEY = globalVar.JWT_KEY; 

let isLoggedIn = globalVar.isLoggedIn;

let loggedInUser = globalVar.loggedInUser;

let activeChannel = globalVar.activeChannel;

checkForLoggedin();
getChannelNames();

element.btnSendMessage.addEventListener('click', () => {
    sendNewMessage(activeChannel);
});

element.btnLogin.addEventListener('click', async () => {
    let userName = element.inputUserName.value;
    let password = element.inputPassword.value;
    let maybeLoggedIn = await loginUser(loggedInUser, userName, password);
    if (maybeLoggedIn) {
        isLoggedIn = true;
        updateLoggedUI();
    } else {
        isLoggedIn = false;
        element.errorLogin.classList.remove('invisible');
    }
});

element.btnLogout.addEventListener('click', () => {
    isLoggedIn = false;
    loggedInUser = { userName: '' };
    localStorage.removeItem(JWT_KEY);
    getChannelNames();
    updateLoggedUI();
});

element.btnSignUp.addEventListener('click', async () => {
    let userName = inputUserName.value;
    let password = inputPassword.value;
    let maybeSignedUp = await signUpUser(loggedInUser, userName, password);
    if (maybeSignedUp) {
        checkForLoggedin();
    } else {
        element.inputPassword.value = '';
        element.inputUserName.value = '';
        element.errorSignUp.classList.remove('invisible');
    }
});

element.btncloseEdit.addEventListener('click', () => {
    element.inputEdit.value = '';
    element.editContainer.classList.add('invisible');
});

element.btnCreateChannel.addEventListener('click', () => {
    let channelName = element.inputChannelName.value;
    let status = element.checkBox.checked;
    createChannel(channelName, status);
});

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
    element.inputUserName.value = '';
    element.inputPassword.value = '';
    if (isLoggedIn) {
        for (const names of element.nameOutput) {
            names.innerText = `${loggedInUser.userName}`;
        }
        element.userForm.classList.add('invisible');
        element.btnLogout.classList.remove('invisible');
        element.createContainer.classList.remove('invisible');
        getChannelNames();
    } else {
        for (const names of element.nameOutput) {
            names.innerText = 'Guest';
        }
        activeChannel = '';
        element.chatContainer.innerHTML = '';
        element.btnLogout.classList.add('invisible');
        element.createContainer.classList.add('invisible');
        element.userForm.classList.remove("invisible")
    }
}

async function changeUserName(name) {
    loggedInUser = { userName: `${name}` };
}

async function sendNewMessage(channelName) {
    const newMessage = {
        message: element.inputMessage.value,
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

async function getChannelNames() {
    element.channelsContainer.innerHTML = '';
    let nameArray = [];
    try {
        const response = await fetch('/api/public/channels');
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
    element.chatContainer.innerHTML = '';
    let messageArray = [];
    try {
        const response = await fetch(
            `/api/public/channels/${name.name}/messages`
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
        createMessageElements(name, message, loggedInUser);
    }
}

export { getMessages, isLoggedIn, changeUserName, JWT_KEY, getChannelNames };
