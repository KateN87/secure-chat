import { getMessages, getChannelNames } from './script.js';
import * as elementS from './getDOM.js';
import { state } from './globalVar.js';// globalVar from './globalVar.js';

const jwt = localStorage.getItem(state.JWT_KEY);
console.log("EditRemove", state.loggedInUser.userName)
async function removeMessage(name, element) {
    let deleteItem = {
        name: name.name,
        user: state.loggedInUser.userName,
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

async function editMessage(name, element) {
    let editedMessage = {
        name: name.name,
        message: elementS.inputEdit.value,
        user: state.loggedInUser.userName,
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
