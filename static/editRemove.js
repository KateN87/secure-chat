import { checkAuth } from './auth.js';
import { getMessages, getChannelNames } from './script.js';
import * as element from './getDOM.js';

async function removeMessage(name, loggedInUser, element) {
    let deleteItem = {
        name: name.name,
        user: loggedInUser.userName,
    };
    if (checkAuth) {
        try {
            const response = await fetch('/api/private/' + element.id, {
                method: 'DELETE',
                body: JSON.stringify(deleteItem),
                headers: {
                    'Content-type': 'application/json',
                },
            });

            if (response.status === 200) {
                getMessages(name);
            } else {
                console.log('Could not remove. Status: ', response.status);
            }
        } catch (error) {
            console.log(
                'Could not DELETE data from the server. Error message: ' +
                    error.message
            );
        }
    } else {
        console.log('You are not logged in');
    }
}

async function editMessage(name, loggedInUser, element) {
    let editedMessage = {
        name: name.name,
        message: element.inputEdit.value,
        user: loggedInUser.userName,
    };
    console.log('FRONT editMessage', element.inputEdit.value);
    if (checkAuth) {
        try {
            const response = await fetch('/api/private/' + element.id, {
                method: 'PUT',
                body: JSON.stringify(editedMessage),
                headers: {
                    'Content-type': 'application/json',
                },
            });

            if (response.status === 200) {
                getMessages(name);
            } else {
                console.log('Could not edit. Status: ', response.status);
            }

            return true;
        } catch (error) {
            console.log(
                'Could not PUT data to the server. Error message: ' +
                    error.message
            );
        }
    } else {
        console.log('You are not logged in');
    }
}

async function createChannel(channelName, status) {
    let newChannel = {
        name: channelName,
        message: element.inputEdit.value,
        private: status,
    };

    if (checkAuth) {
        try {
            const response = await fetch('/api/private/', {
                method: 'POST',
                body: JSON.stringify(newChannel),
                headers: {
                    'Content-type': 'application/json',
                },
            });

            if (response.status === 200) {
                getChannelNames();
            } else {
                console.log('Could not edit. Status: ', response.status);
            }

            return true;
        } catch (error) {
            console.log(
                'Could not PUT data to the server. Error message: ' +
                    error.message
            );
        }
    } else {
        console.log('You are not logged in');
    }
}

export { removeMessage, editMessage, createChannel };
