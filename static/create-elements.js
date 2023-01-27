import { getMessages } from './script.js';
import { checkChannelAuth } from './auth.js';
import { isLoggedIn } from './script.js';

const channelsContainer = document.querySelector('#channelsContainer');

function createChannelElements(name) {
    const messagesChannels = document.createElement('section');
    const spanChannel = document.createElement('span');
    const spanName = document.createElement('span');

    messagesChannels.classList.add('messagesChannels');

    messagesChannels.addEventListener('click', async () => {
        let maybeAllowed = await checkChannelAuth(name);
        console.log(maybeAllowed);
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

function createInfoElements(element) {
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
        const spanIcons = document.createElement('span');
        const iconEdit = document.createElement('i');
        const iconTrash = document.createElement('i');

        iconEdit.className = 'fa-solid fa-pen-to-square';
        iconTrash.className = 'fa-solid fa-trash';
        spanIcons.classList.add('icons');
        spanIcons.appendChild(iconEdit);
        spanIcons.appendChild(iconTrash);
        divInfo.appendChild(spanIcons);
    }

    return divInfo;
}

function createMessageElements(element) {
    const messagesChannels = document.createElement('section');
    const spanMessage = document.createElement('span');

    messagesChannels.classList.add('messagesChannels');
    spanMessage.classList.add('message');
    spanMessage.innerText = element.message;

    messagesChannels.appendChild(spanMessage);
    return messagesChannels;
}

export { createChannelElements, createInfoElements, createMessageElements };
