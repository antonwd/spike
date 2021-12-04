const io = require('socket.io')(3001, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
})

const activeUsers = {}

io.on('connection', socket => {
    socket.on("userJoined", name => {
        activeUsers[socket.id] = name
        socket.broadcast.emit("userConnected", name)
        socket.broadcast.emit("userList", activeUsers)
        socket.emit("chat-message", {message: `Welcome ${name}, it's great to see you here`, userName: "ChatBOT"})
        socket.emit("userList", activeUsers)
    })
    socket.on("send-chat-message", message => {
        socket.broadcast.emit("chat-message", {message: message, userName: activeUsers[socket.id]})
    })
    socket.on("disconnect", () => {
        socket.broadcast.emit("userLeft", activeUsers[socket.id])
        delete activeUsers[socket.id]
        socket.broadcast.emit("userList", activeUsers)
    })
})