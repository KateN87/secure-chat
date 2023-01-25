//ToDo:
//fixa i createMessageElements() så iconerna endast skapar på de meddelanden där user stämmer överens med inloggad

const channelsContainer = document.querySelector('#channelsContainer');
const chatContainer = document.querySelector('#chatContainer');
const main = document.querySelector('main');

getChannelNames();
async function getChannelNames() {
    channelsContainer.innerHTML = '';
    let nameArray = [];
    try {
        const response = await fetch('/api/public/channels', {
            method: 'GET',
        });
        nameArray = await response.json();
        if (response.status !== 200) {
            console.log(
                'Could not connect to server. Status: ' + response.status
            );

            return;
        }
    } catch (error) {
        console.log(
            'Could not GET data from the server. Error message: ' +
                error.message
        );
        return;
    }

    for (const name of nameArray) {
        createChannelElements(name);
    }
}

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
        /* console.log('createElements() name.private: ', name.private); */
        lockIcon.className = 'fa-solid fa-lock';
        spanChannel.appendChild(lockIcon);
    }

    spanChannel.appendChild(spanName);
    messageContainer.appendChild(spanChannel);
    channelsContainer.appendChild(messageContainer);
}

async function getMessages(name) {
    chatContainer.innerHTML = '';
    mesageArray = [];
    console.log('FRONT getMessage() name.name: ', name.name);
    try {
        const response = await fetch(
            `/api/public/channels/${name.name}/messages`,
            {
                method: 'GET',
            }
        );
        messageArray = await response.json();
        if (response.status !== 200) {
            console.log(
                'Could not connect to server. Status: ' + response.status
            );

            return;
        }
    } catch (error) {
        console.log(
            'Could not GET data from the server. Error message: ' +
                error.message
        );
        return;
    }

    for (const message of messageArray) {
        const divMain = document.createElement('div');
        let divInfo = createInfoElements(message);
        let messageContainer = createMessageElements(message);

        divMain.appendChild(divInfo);
        divMain.appendChild(messageContainer);
        chatContainer.appendChild(divMain);
    }
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

    console.log(
        'FRONT createMessageElements element.message: ',
        element.message
    );
    messageContainer.appendChild(spanMessage);
    return messageContainer;
    /* chatContainer.appendChild(divMain); */
}

/* <div>
    <div class='infoContainer'>
        <span class='userName'>Kate</span>
        <span class='date'>Date</span>
        <span class='icons'>
            <i class='fa-solid fa-pen-to-square'></i>
            <i class='fa-solid fa-trash'></i>
        </span>
    </div>

    <section class='messageContainer'>
        <span class='message'>Hej hej</span>
    </section>
</div>; */
