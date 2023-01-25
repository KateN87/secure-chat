const channelsContainer = document.querySelector('#channelsContainer');
const main = document.querySelector("main")

getChannelNames()
async function getChannelNames(){
        channelsContainer.innerHTML = "";
        let nameArray = [];
        try {
            const response = await fetch("/api/public/channels", {
                method: "GET",
            });
            nameArray = await response.json();
            if (response.status !== 200) {
                console.log(
                    "Could not connect to server. Status: " + response.status
                );
    
                return;
            }
        } catch (error) {
            console.log(
                "Could not GET data from the server. Error message: " +
                    error.message
            );
            return;
        }
    
        for (const name of nameArray) {
            createElements(name);
        }
}

function createElements(name){
    const messageContainer = document.createElement("section")
    const spanChannel = document.createElement("span")
    const spanName = document.createElement("span")

    messageContainer.classList.add('messageContainer')

    messageContainer.addEventListener('click', () => {
        getMessages(name)
    })

    spanName.innerText = name.name

    if(name.private){
        const lockIcon = document.createElement("i")
        console.log('createElements() name.private: ', name.private)
        lockIcon.className = "fa-solid fa-lock"
        spanChannel.appendChild(lockIcon)
    } 


    spanChannel.appendChild(spanName)
    messageContainer.appendChild(spanChannel)
    channelsContainer.appendChild(messageContainer)


async function getMessages(name){
    mesageArray = []
    console.log('This is public')
    let thisName = name.name
    console.log(name.name)
    try{
        const response = await fetch("/api/public/channels/"  + `${name.name}`,  {
            method: "GET",
        });
        messageArray = await response.json();
        if (response.status !== 200) {
            console.log(
                "Could not connect to server. Status: " + response.status
            );

            return;
        } 
    } catch (error) {
        console.log(
            "Could not GET data from the server. Error message: " +
                error.message
        );
        return;
    }

/*     for(message of messageArray){
        console.log(message)
    } */

}
}
