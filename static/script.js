import {
    createChannelElements,
    createMessageElements,
} from './create-elements.js';
import { checkAuth } from './auth.js';
import { signUpUser, loginUser } from './loginetc.js';
import { createChannel } from './editRemove.js';
import { containers, forms, buttons, inputs, state } from './globalVar.js';

checkForLoggedin();

buttons.btnSendMessage.addEventListener('click', sendNewMessage);

buttons.btnLogin.addEventListener('click', async () => {
    let userName = inputs.inputUserName.value;
    let password = inputs.inputPassword.value;
    let maybeLoggedIn = await loginUser(userName, password);
    if (maybeLoggedIn) {
        state.isLoggedIn = true;
        console.log('btnLogin', state.isLoggedIn);
        updateLoggedUI();
    } else {
        state.isLoggedIn = false;
        forms.errorLogin.classList.remove('invisible');
    }
});

buttons.btnLogout.addEventListener('click', () => {
    state.isLoggedIn = false;
    state.loggedInUser = { userName: '' };
    localStorage.removeItem(state.JWT_KEY);
    /*     console.log("GET channelNames 2")
    getChannelNames(); */
    updateLoggedUI();
});

buttons.btnSignUp.addEventListener('click', async () => {
    let userName = inputUserName.value;
    let password = inputPassword.value;
    let maybeSignedUp = await signUpUser(userName, password);
    if (maybeSignedUp) {
        checkForLoggedin();
    } else {
        inputs.inputPassword.value = '';
        inputs.inputUserName.value = '';
        inputs.errorSignUp.classList.remove('invisible');
    }
});

buttons.btncloseEdit.addEventListener('click', () => {
    inputs.inputEdit.value = '';
    containers.editContainer.classList.add('invisible');
});

buttons.btnCreateChannel.addEventListener('click', () => {
    let channelName = inputs.inputChannelName.value;
    let status = inputs.checkBox.checked;
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
    containers.channelsContainer.innerHTML = '';
    inputs.inputUserName.value = '';
    inputs.inputPassword.value = '';
    if (state.isLoggedIn) {
        for (const names of forms.nameOutput) {
            names.innerText = `${state.loggedInUser.userName}`;
        }
        forms.userForm.classList.add('invisible');
        buttons.btnLogout.classList.remove('invisible');
        containers.createContainer.classList.remove('invisible');
    } else {
        for (const names of forms.nameOutput) {
            names.innerText = 'Guest';
        }
        state.activeChannel = '';
        containers.chatContainer.innerHTML = '';
        buttons.btnLogout.classList.add('invisible');
        containers.createContainer.classList.add('invisible');
        forms.userForm.classList.remove('invisible');
    }
    getChannelNames();
}

async function changeUserName(name) {
    state.loggedInUser = { userName: `${name}` };
}

async function sendNewMessage() {
    const newMessage = {
        message: inputs.inputMessage.value,
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
            inputs.inputMessage.value = '';
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
    containers.channelsContainer.innerHTML = '';
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
    console.log(state.activeChannel);
    containers.chatContainer.innerHTML = '';
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
