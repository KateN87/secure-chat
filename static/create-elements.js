import { getMessages } from './script.js';
import { checkChannelAuth } from './validation.js';
import { removeMessage, editMessage } from './editRemove.js';
import { containers, forms, buttons, inputs, state } from './globalVar.js';
const channelsContainer = document.querySelector('#channelsContainer');

function createChannelElements(channelName) {
    const messagesChannels = document.createElement('section');
    const spanChannel = document.createElement('span');
    const spanName = document.createElement('span');

   

    messagesChannels.classList.add('messagesChannels');

    messagesChannels.addEventListener('click', async () => {
        const channelBoxes = Array.from(channelsContainer.children);
        for (const box of channelBoxes) {
            box.classList.remove('selectedChannel');
        }
        messagesChannels.classList.add('selectedChannel');
        /* console.log("channelBoxes", channelBoxes) */
        let maybeAllowed = await checkChannelAuth(channelName);
        if (maybeAllowed) {
            containers.newMessageContainer.classList.remove('invisible');
            /* console.log('create-elements 24') */
            getMessages(channelName);
        } else {
            console.log('Not allowed');
        }
    });

    spanName.innerText = channelName.name;

    if (name.private && !state.isLoggedIn) {
        const lockIcon = document.createElement('i');
        lockIcon.className = 'fa-solid fa-lock';
        spanChannel.appendChild(lockIcon);
    }

    spanChannel.appendChild(spanName);
    messagesChannels.appendChild(spanChannel);
    channelsContainer.appendChild(messagesChannels);
    return;
}

 function createInfoElements(channelName, messageObject) {
    const divInfo = document.createElement('div');
    const spanUserName = document.createElement('span');
    const spanDate = document.createElement('span');

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
        /*         console.log("createInfoElements element.userName:", element.userName, "state.loggedInUser.userName", state.loggedInUser) */
        if (messageObject.userName === state.loggedInUser.userName) {
            const spanIcons = document.createElement('span');
            const iconEdit = document.createElement('i');
            const iconTrash = document.createElement('i');

            iconEdit.className = 'fa-solid fa-pen-to-square';
            iconTrash.className = 'fa-solid fa-trash';

            iconEdit.addEventListener('click', () => {
                containers.editContainer.classList.remove('invisible');
                
/*  buttons.btnsendEdit.addEventListener('click', async () => {
                    let editPromise = await editMessage(name, element)
                    console.log('After edit messageg: ', editPromise)
                    if ( editPromise ) {
                        // console.log('CreateInfoElements: iconEdit', editMessage);
                        console.log('create-elements 78')
                        getMessages(name);
                        inputs.inputEdit.value = '';
                        containers.editContainer.classList.add('invisible');
                    }
                });  */
            });
            iconTrash.addEventListener('click', () => {
                removeMessage(channelName, messageObject);
            });

            spanIcons.classList.add('icons');
            spanIcons.appendChild(iconEdit);
            spanIcons.appendChild(iconTrash);
            divInfo.appendChild(spanIcons);
        }
    }

    return divInfo;
}

buttons.btnsendEdit.addEventListener('click', async (e) => {
    inputs.inputEdit.value = element.message;
    let editPromise = await editMessage(channelName, messageObject)

    if ( editPromise ) {

        getMessages(channelName);
        inputs.inputEdit.value = '';
        containers.editContainer.classList.add('invisible');
    }
});


function createMessageElements(channelName, messageObject) {
    const divMain = document.createElement('div');
    const messagesChannels = document.createElement('section');
    const spanMessage = document.createElement('span');
    let divInfo = createInfoElements(channelName, messageObject);

    console.log("CreateMessageElements")
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
    console.log("CreateMessageElements2")

}

export { createChannelElements, createInfoElements, createMessageElements };
