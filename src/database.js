const userData = [
    {
        userName: 'Kate',
        password: 'hej123',
    },
    {
        userName: 'Rut',
        password: 'sjögrässallad'
    }
];

const channelData = [
    {
        name: 'Cats',
        messages: [
            {
                id: 1,
                message: 'Cats are what they are', //(if(!isDeleted) sätt detta till null),
                timeCreated: '2023-01-25T17:57:34.488Z', //Lägger till datum
                userName: 'Kate', //(if(!isDeleted) sätt detta till null)
                isChanged: false, //ändra till true vid ändring
                timeChanged: '', //lägger in datum vid ändring
                isDeleted: false, //ändrar till true
                timeDeleted: '', //lägger till datum
            },
            {
                id: 2,
                message: 'You are correct!', //(if(!isDeleted) sätt detta till null),
                timeCreated: '2023-01-25T17:57:34.488Z', //Lägger till datum
                userName: 'Richard', //(if(!isDeleted) sätt detta till null)
                isChanged: false, //ändra till true vid ändring
                timeChanged: '', //lägger in datum vid ändring
                isDeleted: false, //ändrar till true
                timeDeleted: '', //lägger till datum
            },
            {
                id: 3,
                message: 'Everything is true', //(if(!isDeleted) sätt detta till null),
                timeCreated: '2023-01-25T17:57:34.488Z', //Lägger till datum
                userName: 'Rut', //(if(!isDeleted) sätt detta till null)
                isChanged: false, //ändra till true vid ändring
                timeChanged: '', //lägger in datum vid ändring
                isDeleted: false, //ändrar till true
                timeDeleted: '', //lägger till datum
            },
        ],
        private: false, //Kan även vara false
    },
    {
        name: 'Dogs',
        messages: [
            {
                id: 1,
                message: 'Dogs are awesome', //(if(!isDeleted) sätt detta till null),
                timeCreated: '2023-01-25T17:57:34.488Z', //Lägger till datum
                userName: 'Kate', //(if(!isDeleted) sätt detta till null)
                isChanged: false, //ändra till true vid ändring
                timeChanged: '', //lägger in datum vid ändring
                isDeleted: false, //ändrar till true
                timeDeleted: '', //lägger till datum
            },
        ],
        private: true, //Kan även vara false
    },
    {
        name: 'Public',
        messages: [
            {
                id: 1,
                message: 'This is a public channel', //(if(!isDeleted) sätt detta till null),
                timeCreated: '2023-01-25T17:57:34.488Z', //Lägger till datum
                userName: 'Kate', //(if(!isDeleted) sätt detta till null)
                isChanged: false, //ändra till true vid ändring
                timeChanged: '', //lägger in datum vid ändring
                isDeleted: false, //ändrar till true
                timeDeleted: '', //lägger till datum
            },
        ],
        private: false, //Kan även vara false
    },
    {
        name: 'Private',
        messages: [
            {
                id: 1,
                message: 'This is a private channel', //(if(!isDeleted) sätt detta till null),
                timeCreated: '2023-01-25T17:57:34.488Z', //Lägger till datum
                userName: 'Kate', //(if(!isDeleted) sätt detta till null)
                isChanged: false, //ändra till true vid ändring
                timeChanged: '', //lägger in datum vid ändring
                isDeleted: false, //ändrar till true
                timeDeleted: '', //lägger till datum
            },
        ],
        private: true, //Kan även vara false
    },
];

export { userData, channelData };
