//ToDo:
//fixa i createMessageElements() så iconerna endast skapas på de meddelanden där user stämmer överens med inloggad
import {
    createChannelElements,
    createInfoElements,
    createMessageElements,
} from './create-elements.js';

const channelsContainer = document.querySelector('#channelsContainer');
const chatContainer = document.querySelector('#chatContainer');
const userImg = document.querySelector('#userImg');
const loginForm = document.querySelector('.login-form');
const logoutForm = document.querySelector('.logout-form');
const btnLogin = document.querySelector('#btnLogin');
const btnLogout = document.querySelector('#btnLogout');
const errorLogin = document.querySelector('#error-login');
const nameOutput = document.querySelectorAll('.name-output');
const inputMessage = document.querySelector('#input-message')
const btnSendMessage = document.querySelector('#send-message')

const JWT_KEY = 'secureChat-jwt';

let isLoggedIn = false;

let loggedInUser = { userName: '' };

let activeChannel = ""

checkForLoggedin();
getChannelNames();

btnSendMessage.addEventListener('click', () => {
    sendNewMessage(activeChannel)
})

async function sendNewMessage(channelName){
    console.log('this is the channelName', channelName)
}

async function checkForLoggedin() {
    let maybeLoggedIn = await checkAuth();
    if (maybeLoggedIn) {
        /* console.log('FRONT checkforLoggedIn() loggedinUser', loggedInUser) */
        loginForm.classList.remove('invisible');
        isLoggedIn = true;
        updateLoggedUI();
        return;
    }
}

function updateLoggedUI() {
/*     console.log('updateLoggedIn-function, isLoggedIn', isLoggedIn);
    console.log('FRONT updateLogged() loggedInUser.userName:', loggedInUser.userName) */
    if (isLoggedIn) {
        for (const names of nameOutput) {
/*             console.log(
                'updateLoggedIn-function Update login inside for',
                loggedInUser,
                typeof loggedInUser
            ); */
            names.innerText = `${loggedInUser.userName}`;

        }
        loginForm.classList.toggle('invisible');
        userImg.src = '/img/userPhoto.png';
    } else {
        for (const names of nameOutput) {
            names.innerText = 'Guest';
            
        }
        logoutForm.classList.toggle('invisible');
        userImg.src = '/img/51-TrKw+YtL.jpg';
    }
}

userImg.addEventListener('click', () => {
    if (isLoggedIn) {
        logoutForm.classList.toggle('invisible');
    } else {
        loginForm.classList.toggle('invisible');
    }
});

btnLogin.addEventListener('click', loginUser);

btnLogout.addEventListener('click', () => {
    isLoggedIn = false;
    errorLogin.classList.add('invisible');
    localStorage.removeItem(JWT_KEY);
    updateLoggedUI();
});

async function loginUser() {
    const user = {
        userName: inputUserName.value,
        password: inputPassword.value,
    };
    console.log('FRONT loginUser user: ', user)
    const options = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json',
        },
    };

    try {
        const response = await fetch('/api/login/', options);
        if (response.status === 200) {
            console.log('Login successful!');
            loggedInUser = await response.json();
            console.log('FRONT loginUser() loggedInUser.userName: ', loggedInUser.userName);

            localStorage.setItem(JWT_KEY, loggedInUser.token);

            isLoggedIn = true;
            loggedInUser.userName = loggedInUser.userName;

            updateLoggedUI();
        } else {
            isLoggedIn = false;
            errorLogin.classList.remove('invisible');
            console.log('Login failed : ' + response.status);
        }
    } catch (error) {
        console.log(
            'Could not POST to server. Error Messagge: ' + error.message
        );
        return;
    }
    inputUserName.value = '';
    inputPassword.value = '';
}

async function checkAuth() {
    const jwt = localStorage.getItem(JWT_KEY);

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt,
        },
        //headers behövs om man använder JWT
    };

    const response = await fetch('/api/private/', options);
    /* console.log('FRONT checkAuth Response.status: ', response.status); */

    if (response.status === 200) {
        const user = await response.json();
       /*  console.log('func checkAuth: server responded with user: ', user); */
        loggedInUser = user;
        console.log('allt gick bra', user);
        return true;
    }
    console.log('Oops, no valid token');
    return false;
}

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

async function getMessages(name) {
    activeChannel = name.name
    console.log(activeChannel)
    chatContainer.innerHTML = '';
    let messageArray = [];
/*     console.log('FRONT getMessage() name.name: ', name.name); */
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

export { getMessages };
