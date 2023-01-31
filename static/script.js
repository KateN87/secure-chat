import {
    createChannelElements,
    createMessageElements,
} from './create-elements.js';
import { checkAuth } from './auth.js';
import { signUpUser, loginUser } from './loginetc.js';
import * as element from './getDOM.js';
import { createChannel } from './editRemove.js';
import { state } from './globalVar.js';

checkForLoggedin()

element.btnSendMessage.addEventListener('click', sendNewMessage);

element.btnLogin.addEventListener('click', async () => {
    let userName = element.inputUserName.value;
    let password = element.inputPassword.value;
    let maybeLoggedIn = await loginUser(userName, password);
    if (maybeLoggedIn) {
        state.isLoggedIn = true;
        console.log("btnLogin", state.isLoggedIn)
        updateLoggedUI();
    } else {
        state.isLoggedIn = false;
        element.errorLogin.classList.remove('invisible');
    }
});

element.btnLogout.addEventListener('click', () => {
    state.isLoggedIn = false;
    state.loggedInUser = { userName: '' };
    localStorage.removeItem(state.JWT_KEY);
/*     console.log("GET channelNames 2")
    getChannelNames(); */
    updateLoggedUI();
});

element.btnSignUp.addEventListener('click', async () => {
    let userName = inputUserName.value;
    let password = inputPassword.value;
    let maybeSignedUp = await signUpUser(userName, password);
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
    //Om true, uppdaterat state.loggedInUser
    //Om false, state.loggedInUser = guest
    let maybeLoggedIn = await checkAuth();

    if (maybeLoggedIn) {
        state.isLoggedIn = true;

    } else {

        state.loggedInUser = { userName: 'Guest' };
    }
    
    updateLoggedUI();

    
}

function updateLoggedUI() {
    element.channelsContainer.innerHTML = '';
    element.inputUserName.value = '';
    element.inputPassword.value = '';
    if (state.isLoggedIn) {
        for (const names of element.nameOutput) {
            names.innerText = `${state.loggedInUser.userName}`;
        }
        element.userForm.classList.add('invisible');
        element.btnLogout.classList.remove('invisible');
        element.createContainer.classList.remove('invisible');
         
    } else {

        for (const names of element.nameOutput) {
            names.innerText = 'Guest';
        }
        state.activeChannel = '';
        element.chatContainer.innerHTML = '';
        element.btnLogout.classList.add('invisible');
        element.createContainer.classList.add('invisible');
        element.userForm.classList.remove("invisible")
    }
    getChannelNames();
}

async function changeUserName(name) {
    state.loggedInUser = { userName: `${name}` };
}

async function sendNewMessage() {
    const newMessage = {
        message: element.inputMessage.value,
        userName: state.loggedInUser.userName,
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
            '/api/public/channels/' + `${state.activeChannel}`,
            options
        );
        if (response.status === 200) {
            let channel = await response.json();
            console.log('This is channel', channel);
            await getMessages(channel);
            element.inputMessage.value = ''
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
    state.activeChannel = name.name;
    console.log(state.activeChannel)
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
        createMessageElements(name, message, state.loggedInUser);
    }
}

export { getMessages, changeUserName, getChannelNames };
