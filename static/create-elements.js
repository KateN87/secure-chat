import { getMessages } from './script.js';

const channelsContainer = document.querySelector('#channelsContainer');

function createChannelElements(name) {
    const messageContainer = document.createElement('section');
    const spanChannel = document.createElement('span');
    const spanName = document.createElement('span');

    messageContainer.classList.add('messageContainer');

    messageContainer.addEventListener('click', () => {
        getMessages(name);
    });

    spanName.innerText = name.name;

    if (name.private) {
        const lockIcon = document.createElement('i');
       /*  console.log('FRONT createElements() name.private: ', name.name, name.private); */
        lockIcon.className = 'fa-solid fa-lock';
        spanChannel.appendChild(lockIcon);
    }

    spanChannel.appendChild(spanName);
    messageContainer.appendChild(spanChannel);
    channelsContainer.appendChild(messageContainer);
}
function createInfoElements(element) {
    const divInfo = document.createElement('div');
    const spanUserName = document.createElement('span');
    const spanDate = document.createElement('span');
    const spanIcons = document.createElement('span');
    const iconEdit = document.createElement('i');
    const iconTrash = document.createElement('i');

    divInfo.classList.add('infoContainer');

    spanUserName.classList.add('userName');
    spanUserName.innerText = element.userName;

    spanDate.classList.add('date');
    spanDate.innerText = element.timeCreated;

    spanIcons.classList.add('icons');

    iconEdit.className = 'fa-solid fa-pen-to-square';
    iconTrash.className = 'fa-solid fa-trash';

    spanIcons.appendChild(iconEdit);
    spanIcons.appendChild(iconTrash);

    divInfo.appendChild(spanUserName);
    divInfo.appendChild(spanDate);
    divInfo.appendChild(spanIcons);

    return divInfo;
    /* chatContainer.appendChild(divMain); */
}

function createMessageElements(element) {
    const messageContainer = document.createElement('section');
    const spanMessage = document.createElement('span');

    messageContainer.classList.add('messageContainer');
    spanMessage.classList.add('message');
    spanMessage.innerText = element.message;

/*     console.log(
        'FRONT createMessageElements element.message: ',
        element.message
    ); */
    messageContainer.appendChild(spanMessage);
    return messageContainer;
    /* chatContainer.appendChild(divMain); */
}

export { createChannelElements, createInfoElements, createMessageElements };
