import { JWT_KEY, changeUserName } from './script.js';

async function checkChannelAuth(name) {
    if (name.private) {
        const isAuthorized = await checkAuth();
        if (isAuthorized) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

async function checkAuth() {
    const jwt = localStorage.getItem(JWT_KEY);

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
        changeUserName(user.userName);
        return true;
    } else {
        return false;
    }
}

export { checkAuth, checkChannelAuth };
