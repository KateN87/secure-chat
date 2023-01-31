import { getMessages, isLoggedIn } from './script.js';
import { checkChannelAuth } from './auth.js';
import { removeMessage, editMessage } from './editRemove.js';
import * as elementN from './getDOM.js';

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

    if (name.private && !isLoggedIn) {
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
    spanDate.classList.add('date');
    
    if(!element.deleted){
        spanDate.innerText = element.timeCreated;
        spanUserName.innerText = element.userName;
    }

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
                elementN.editContainer.classList.remove('invisible');
                elementN.inputEdit.value = element.message;
                elementN.btnsendEdit.addEventListener('click', () => {
                    if (editMessage(name, loggedInUser, element)) {
                        elementN.inputEdit.value = '';
                        elementN.editContainer.classList.add('invisible');
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

function createMessageElements(name, element, loggedInUser) {
    const divMain = document.createElement('div');
    const messagesChannels = document.createElement('section');
    const spanMessage = document.createElement('span');
    let divInfo = createInfoElements(name, loggedInUser, element)

    messagesChannels.classList.add('messagesChannels');

    divMain.appendChild(divInfo)
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
    divMain.appendChild(messagesChannels);
    elementN.chatContainer.appendChild(divMain);

    return messagesChannels;
}

export { createChannelElements, createInfoElements, createMessageElements };
