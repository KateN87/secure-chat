import { getMessages, isLoggedIn } from './script.js';
import { checkChannelAuth } from './auth.js';
import { removeMessage, editMessage } from './editRemove.js';
import * as elementName from './getDOM.js';

/* import * as globalVar from './globalVar.js';

const JWT_KEY = globalVar.JWT_KEY;

let isLoggedIn = globalVar.isLoggedIn;

let loggedInUser = globalVar.loggedInUser;

let activeChannel = globalVar.activeChannel; */

const channelsContainer = document.querySelector('#channelsContainer');

function createChannelElements(name) {
    const messagesChannels = document.createElement('section');
    const spanChannel = document.createElement('span');
    const spanName = document.createElement('span');

    messagesChannels.classList.add('messagesChannels');

    messagesChannels.addEventListener('click', async () => {
        let maybeAllowed = await checkChannelAuth(name);
        if (maybeAllowed) {
            getMessages(name);
        } else {
            console.log('Not allowed');
        }
    });

    spanName.innerText = name.name;

    if (name.private) {
        const lockIcon = document.createElement('i');
        lockIcon.className = 'fa-solid fa-lock';
        spanChannel.appendChild(lockIcon);
    }

    spanChannel.appendChild(spanName);
    messagesChannels.appendChild(spanChannel);
    channelsContainer.appendChild(messagesChannels);
}

function createInfoElements(name, loggedInUser, element) {
    const divInfo = document.createElement('div');
    const spanUserName = document.createElement('span');
    const spanDate = document.createElement('span');

    divInfo.classList.add('infoContainer');

    spanUserName.classList.add('userName');
    spanUserName.innerText = element.userName;

    spanDate.classList.add('date');
    spanDate.innerText = element.timeCreated;

    divInfo.appendChild(spanUserName);
    divInfo.appendChild(spanDate);

    if (isLoggedIn) {
        if (element.userName === loggedInUser.userName) {
            const spanIcons = document.createElement('span');
            const iconEdit = document.createElement('i');
            const iconTrash = document.createElement('i');

            iconEdit.className = 'fa-solid fa-pen-to-square';
            iconTrash.className = 'fa-solid fa-trash';

            iconEdit.addEventListener('click', () => {
                elementName.editContainer.classList.remove('invisible');
                elementName.inputEdit.value = element.message;
                elementName.btnsendEdit.addEventListener('click', () => {
                    if (editMessage(name, loggedInUser, element)) {
                        elementName.inputEdit.value = '';
                        elementName.editContainer.classList.add('invisible');
                    }
                });
            });
            iconTrash.addEventListener('click', () => {
                removeMessage(name, loggedInUser, element);
            });

            spanIcons.classList.add('icons');
            spanIcons.appendChild(iconEdit);
            spanIcons.appendChild(iconTrash);
            divInfo.appendChild(spanIcons);
        }
    }

    return divInfo;
}

function createMessageElements(element) {
    const messagesChannels = document.createElement('section');
    const spanMessage = document.createElement('span');

    messagesChannels.classList.add('messagesChannels');
    /* spanMessage.classList.add('message'); */
    if (!element.deleted) {
        spanMessage.innerText = element.message;
    } else {
        spanMessage.classList.add('removed');
        spanMessage.innerHTML = 'This message has been deleted';
    }

    if (element.timeEdited) {
        const spanEdited = document.createElement('span');
        spanEdited.classList.add('edited');
        spanEdited.innerText = `Edit: ${element.timeEdited}`;
        messagesChannels.appendChild(spanEdited);
    }

    messagesChannels.appendChild(spanMessage);
    return messagesChannels;
}

export { createChannelElements, createInfoElements, createMessageElements };
