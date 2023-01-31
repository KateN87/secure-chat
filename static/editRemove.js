import { getMessages, getChannelNames } from './script.js';
import * as elementS from './getDOM.js';

let JWT_KEY = 'secureChat-jwt';
const jwt = localStorage.getItem(JWT_KEY);

async function removeMessage(name, loggedInUser, element) {
    let deleteItem = {
        name: name.name,
        user: loggedInUser.userName,
    };
        try {
            const response = await fetch('/api/private/' + element.id, {
                method: 'DELETE',
                body: JSON.stringify(deleteItem),
                headers:                 {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwt,
                }
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
}

async function editMessage(name, loggedInUser, element) {

    let editedMessage = {
        name: name.name,
        message: elementS.inputEdit.value,
        user: loggedInUser.userName,
    };

        try {
            const response = await fetch('/api/private/' + element.id, {
                method: 'PUT',
                body: JSON.stringify(editedMessage),
                headers: 
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwt,
                }
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
}

async function createChannel(channelName, status) {

    let newChannel = {
        name: channelName,
        message: elementS.inputEdit.value,
        private: status,
    };
    console.log("FRONT createChannel channelName, status", channelName, status)

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
                console.log("RESPONSE:STATUS",response.status)
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
    } 

export { removeMessage, editMessage, createChannel };
