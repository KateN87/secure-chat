const containers = {
    channelsContainer: document.querySelector('#channelsContainer'),
    chatContainer: document.querySelector('#chatContainer'),
    editContainer: document.querySelector('.editContainer'),
    createContainer: document.querySelector('.createContainer'),
    newMessageContainer: document.querySelector('.new-message'),
};

const forms = {
    userForm: document.querySelector('.user-form'),
    nameOutput: document.querySelectorAll('.name-output'),
    errorLogin: document.querySelector('#error-login'),
    errorSignUp: document.querySelector('#error-signup'),
    errorChannel: document.querySelector('.error-channel'),
};

const buttons = {
    btnLogin: document.querySelector('#btnLogin'),
    btnSignUp: document.querySelector('#btnSignUp'),
    btnLogout: document.querySelector('#btnLogout'),
    btnSendMessage: document.querySelector('#send-message'),
    btnsendEdit: document.querySelector('#sendEdit'),
    btncloseEdit: document.querySelector('#closeEdit'),
    btnCreateChannel: document.querySelector('#btnCreateChannel'),
};

const inputs = {
    inputMessage: document.querySelector('#inputMessage'),
    inputUserName: document.querySelector('#inputUserName'),
    inputPassword: document.querySelector('#inputPassword'),
    inputEdit: document.querySelector('#inputEdit'),
    inputChannelName: document.querySelector('#inputChannelName'),
    checkBox: document.querySelector('#Private'),
};

const state = {
    JWT_KEY: 'secureChat-jwt',
    isLoggedIn: false,
    loggedInUser: { userName: '' },
    activeChannel: '',
};

export { containers, forms, buttons, inputs, state };
