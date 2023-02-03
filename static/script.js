import {
    createChannelElements,
    createMessageElements,
} from './create-elements.js';
import { authorization, showWrong } from './validation.js';
import { tryLogin, trySignUp } from './loginetc.js';
import { createChannel } from './editRemove.js';
import { containers, forms, buttons, inputs, state } from './globalVar.js';

checkForLoggedin();
buttons.btnSendMessage.addEventListener('click', sendNewMessage);

forms.submitForms.forEach((form) =>
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (form.checkValidity() === false) {
            form.reportValidity();
            return;
        }
        if (e.submitter.id === 'btnLogin') {
            tryLogin();
        }
        if (e.submitter.id === 'btnSignUp') {
            trySignUp();
        }
        if (e.submitter.id === 'btnCreateChannel') {
            tryNewChannel();
        }
    })
);

buttons.btnLogout.addEventListener('click', () => {
    state.isLoggedIn = false;
    state.loggedInUser = { userName: 'Guest' };
    localStorage.removeItem(state.JWT_KEY);
    updateLoggedUI();
});

buttons.btncloseEdit.addEventListener('click', () => {
    inputs.inputEdit.value = '';
    containers.editContainer.classList.add('invisible');
});

async function tryNewChannel() {
    if (await createChannel()) {
        getChannelNames();
        forms.errorChannel.classList.add('invisible');
        inputs.inputChannelName.value = '';
    } else {
        forms.errorChannel.classList.remove('invisible');
    }
}

async function checkForLoggedin() {
    let maybeLoggedIn = await authorization();

    if (maybeLoggedIn) {
        state.loggedInUser = { userName: `${maybeLoggedIn.userName}` };
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
    containers.chatContainer.innerHTML = '';
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
        buttons.btnLogout.classList.add('invisible');
        containers.createContainer.classList.add('invisible');
        forms.userForm.classList.remove('invisible');
        forms.errorSignUp.classList.add('invisible');
        forms.errorLogin.classList.add('invisible');
        containers.newMessageContainer.classList.add('invisible');
    }
    getChannelNames();
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
            '/api/public/channels/' + `${state.activeChannel.name}`,
            options
        );
        if (response.status === 200) {
            /* let channel = await response.json(); */
            /* console.log('This is channel', channel); */
            await getMessages();
            inputs.inputMessage.value = '';
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

async function getChannelNames() {
    containers.channelsContainer.innerHTML = '';
    let nameArray = [];
    try {
        const response = await fetch('/api/public/channels');
        nameArray = await response.json();
        if (response.status !== 200) {
            showWrong();
            console.log(
                'Could not connect to server. Status: ' + response.status
            );

            return;
        }
    } catch (error) {
        showWrong();
        console.log(
            'Could not GET data from the server. Error message: ' +
                error.message
        );
        return;
    }

    for (const channelName of nameArray) {
        createChannelElements(channelName);
    }
}

async function getMessages() {
    containers.chatContainer.innerHTML = '';
    let messageArray = [];
    try {
        const response = await fetch(
            `/api/public/channels/${state.activeChannel.name}/messages`
        );
        messageArray = await response.json();
        if (response.status !== 200) {
            console.log(
                'Could not connect to server. Status: ' + response.status
            );

            return;
        }
    } catch (error) {
        showWrong();
        console.log(
            'Could not GET data from the server. Error message: ' +
                error.message
        );
        return;
    }

    for (const message of messageArray) {
        createMessageElements(message);
    }
}

export { getMessages, getChannelNames, updateLoggedUI, checkForLoggedin };
