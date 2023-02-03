import { getMessages } from './script.js';
import { state, inputs } from './globalVar.js';
import { showWrong } from './validation.js';

async function removeMessage(messageObject) {
    const jwt = localStorage.getItem(state.JWT_KEY);
    let deleteItem = {
        name: state.activeChannel.name,
        user: state.loggedInUser.userName,
    };

    try {
        const response = await fetch('/api/private/' + messageObject.id, {
            method: 'DELETE',
            body: JSON.stringify(deleteItem),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwt,
            },
        });

        if (response.status === 200) {
            getMessages();
        } else {
            console.log('Could not remove. Status: ', response.status);
        }
    } catch (error) {
        console.log(
            'Could not DELETE data from the server. Error message: ' +
                error.message
        );
    }
}

async function editMessage(messageObject) {
    const jwt = localStorage.getItem(state.JWT_KEY);

    let editedMessage = {
        name: state.activeChannel.name,
        message: inputs.inputEdit.value,
        user: state.loggedInUser.userName,
    };

    try {
        const response = await fetch('/api/private/' + messageObject.id, {
            method: 'PUT',
            body: JSON.stringify(editedMessage),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwt,
            },
        });

        if (response.status !== 200) {
            console.log('Could not edit. Status: ', response.status);
            return false;
        }
        return true;
    } catch (error) {
        console.log(
            'Could not PUT data to the server. Error message: ' + error.message
        );
    }
}

async function createChannel() {
    const jwt = localStorage.getItem(state.JWT_KEY);

    let newChannel = {
        name: inputs.inputChannelName.value,
        private: inputs.checkBox.checked,
    };
    try {
        const response = await fetch('/api/private/', {
            method: 'POST',
            body: JSON.stringify(newChannel),
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer ' + jwt,
            },
        });

        if (response.status === 200) {
            return true;
        } else {
            console.log('Could not edit. Status: ', response.status);
            return false;
        }
    } catch (error) {
        showWrong();
        console.log(
            'Could not PUT data to the server. Error message: ' + error.message
        );
    }
}

export { removeMessage, editMessage, createChannel };
