const socket = io("http://localhost:3001")

const loginScreenUserName = document.getElementById("userName")
const enterChatButton = document.getElementById("enterChat")
const leaveChatButton = document.getElementById("leaveChatButton")
const chatContainer = document.getElementById("chatContainer")
const sendMessageButton = document.getElementById("sendMessageButton")

const loginScreen = document.getElementById("loginScreen")
const chatScreen = document.getElementById("chatScreen")

let myName = '';

loginScreenUserName.addEventListener("keyup", () => {
    if (event.keyCode === 13) {
        event.preventDefault();
        enterChatButton.click();
      }
})
enterChatButton.addEventListener("click", () => {
    socket.emit("userJoined", loginScreenUserName.value)
    myName = loginScreenUserName.value;
    startChat()
})

function startChat() {
    loginScreen.style.display = "none"
    chatScreen.style.display = "flex"

    appendUserJoined("You")

    socket.on("userConnected", name => {
        appendUserJoined(name)
    })

    socket.on("userLeft", name => {
        appendUserJoined(name, true)
    })

    socket.on("chat-message", data => {
        appendMessage(data)
    })

    socket.on("userList", data => {
        updateUserList(data)
    })

    function currentTime() {
        function addZero(i) {
            if (i < 10) {i = "0" + i}
            return i;
        }
        
        const timeNow = new Date();
        let h = addZero(timeNow.getHours());
        let m = addZero(timeNow.getMinutes());
        let s = addZero(timeNow.getSeconds());
        let time = h + ":" + m + ":" + s;

        return time;
    }

    leaveChatButton.addEventListener('click', () => {
        document.querySelector("#chatScreen").style.display = "none"
        document.querySelector("#loginScreen").style.display = "flex"
        socket.disconnect()
    })

    const buildMessageBlock = (time, user, content) => {
        const block = document.createElement("div")
        block.classList.add("message")
        block.innerHTML = `<div class="time-and-name">
                                <span class="time">${time}</span>
                                <span class="name">${user}</span>
                            </div>
                            <div class="message-content">
                                ${content}
                            </div>`

        return block;
    }

    function appendMessage(data) {
        chatContainer.append(buildMessageBlock(currentTime(), data.userName, data.message))
        chatContainer.scrollTop = chatContainer.scrollHeight
    }

    function appendUserJoined(userName, left = false) {
        const block = document.createElement("div")
        block.classList.add("message")
        block.innerHTML = `<div class="time-and-name">
                                <span class="time">${currentTime()}</span>
                                <span class="name">${userName} ${left ? 'left' : 'joined'}</span>
                            </div>`
        chatContainer.append(block)
    }
    
    const messageContent = document.getElementById("messageContent")
    messageContent.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            sendMessageButton.click();
          }
    })

    sendMessageButton.addEventListener('click', () => {       
        let messageTmp = messageContent.value
        messageTmp = messageTmp.replace(' ', '')
        if(messageTmp.length != 0) {
            socket.emit("send-chat-message", messageContent.value)
            const messageObject = {message: messageContent.value, userName: myName}
            appendMessage(messageObject)
        }
        
        messageContent.value = ''
        messageContent.focus()
    })

    function updateUserList(data) {
        const usersList = document.getElementById("usersList")
        usersList.innerHTML = "";
        Object.keys(data).map((item) => {
            const userLine = document.createElement("div")
            userLine.innerText = data[item]
            usersList.append(userLine)
        })
    }
}