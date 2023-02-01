import { state } from './globalVar.js'; // globalVar from './globalVar.js';

async function checkChannelAuth(name) {
    if (name.private) {
        const isAuthorized = await authorization();
        if (isAuthorized) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

async function authorization() {
    const jwt = localStorage.getItem(state.JWT_KEY);

    if (jwt === null) {
        return false;
    }

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt,
        },
    };
    const response = await fetch('/api/private/', options);

    if (response.status === 200) {
        let user = await response.json();
        return user;
    } else {
        return false;
    }
}

export { checkChannelAuth, authorization };
