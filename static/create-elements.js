import { getMessages } from './script.js';
import { checkChannelAuth } from './validation.js';
import { removeMessage, editMessage } from './editRemove.js';
import { containers, buttons, inputs, state } from './globalVar.js';
const channelsContainer = document.querySelector('#channelsContainer');

async function createChannelElements(channelName) {
    const messagesChannels = document.createElement('section');
    const spanChannel = document.createElement('span');
    const spanName = document.createElement('span');

    messagesChannels.classList.add('messagesChannels');
    let maybeAllowed = await checkChannelAuth(channelName);

    if (maybeAllowed) {
        messagesChannels.addEventListener('click', async () => {
            const channelBoxes = Array.from(channelsContainer.children);

            for (const box of channelBoxes) {
                box.classList.remove('selectedChannel');
            }
            state.activeChannel = channelName;
            messagesChannels.classList.add('selectedChannel');
            containers.newMessageContainer.classList.remove('invisible');

            getMessages();
        });
    } else {
        let tooltip = document.createElement('span');
        tooltip.innerHTML =
            '<p id="tooltip-text">Log in to see this channel</p>';
        messagesChannels.appendChild(tooltip);
        tooltip.style.display = 'none';

        messagesChannels.addEventListener('mouseover', () => {
            tooltip.style.display = 'block';
        });
        messagesChannels.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    }

    spanName.innerText = channelName.name;

    if (channelName.private && !state.isLoggedIn) {
        const lockIcon = document.createElement('i');
        lockIcon.className = 'fa-solid fa-lock';
        spanChannel.appendChild(lockIcon);
    }

    spanChannel.appendChild(spanName);
    messagesChannels.appendChild(spanChannel);
    channelsContainer.appendChild(messagesChannels);
    return;
}

function createInfoElements(messageObject) {
    const divInfo = document.createElement('div');
    const spanUserName = document.createElement('span');
    const spanDate = document.createElement('span');
    let channelName = state.activeChannel;
    divInfo.classList.add('infoContainer');
    spanUserName.classList.add('userName');
    spanDate.classList.add('date');

    if (!messageObject.deleted) {
        spanDate.innerText = messageObject.timeCreated;
        spanUserName.innerText = messageObject.userName;
    }

    divInfo.appendChild(spanUserName);
    divInfo.appendChild(spanDate);

    if (state.isLoggedIn) {
        if (messageObject.userName === state.loggedInUser.userName) {
            const spanIcons = document.createElement('span');
            const iconEdit = document.createElement('i');
            const iconTrash = document.createElement('i');

            iconEdit.className = 'fa-solid fa-pen-to-square';
            iconTrash.className = 'fa-solid fa-trash';

            iconEdit.addEventListener('click', () => {
                containers.editContainer.classList.remove('invisible');
                selectedMessage = messageObject;
                inputs.inputEdit.value = selectedMessage.message;
            });
            iconTrash.addEventListener('click', () => {
                removeMessage(messageObject);
            });

            spanIcons.classList.add('icons');
            spanIcons.appendChild(iconEdit);
            spanIcons.appendChild(iconTrash);
            divInfo.appendChild(spanIcons);
        }
    }

    return divInfo;
}
let selectedMessage = null;

buttons.btnsendEdit.addEventListener('click', async () => {
    let editPromise = await editMessage(selectedMessage);
    if (editPromise) {
        getMessages();
        inputs.inputEdit.value = '';
        containers.editContainer.classList.add('invisible');
    }
});

function createMessageElements(messageObject) {
    const divMain = document.createElement('div');
    const messagesChannels = document.createElement('section');
    const spanMessage = document.createElement('span');
    let divInfo = createInfoElements(messageObject);

    messagesChannels.classList.add('messagesChannels');

    divMain.appendChild(divInfo);
    if (!messageObject.deleted) {
        spanMessage.innerText = messageObject.message;
    } else {
        spanMessage.classList.add('removed');
        spanMessage.innerHTML = 'This message has been deleted';
    }

    if (messageObject.timeEdited) {
        const spanEdited = document.createElement('span');
        spanEdited.classList.add('edited');
        spanEdited.innerText = `Edit: ${messageObject.timeEdited}`;
        messagesChannels.appendChild(spanEdited);
    }

    messagesChannels.appendChild(spanMessage);
    divMain.appendChild(messagesChannels);
    containers.chatContainer.appendChild(divMain);
}

export { createChannelElements, createInfoElements, createMessageElements };
