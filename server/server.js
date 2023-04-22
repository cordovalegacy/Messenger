const express = require('express')
const app = express()
const socket_io = require('socket.io')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config() //will allow us to store PORT variable in .env file
const PORT = process.env.PORT //will be stored in .env

app.use(express.json(), express.urlencoded({ extended:true })) //json middleware
app.use(cors({credentials:true, origin:true}))
app.use(cookieParser())

require('./config/mongoose.config')
require('./routes/user.routes')(app) //user routes
require('./routes/conversation.routes')(app)
require('./routes/message.routes')(app)

// start up the server listening
const server = app.listen(PORT, () => console.log(`Server Running on PORT: ${PORT}`))

// Using the Express app server, attach the Socket.io server
const io = socket_io(server, {
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['*'],
        credentials: true
    }
})

//start listening for someone to try and connect to our socket
io.on("connection", (socket) => {
    console.log("Server Socket Id: ", socket.id)
    
    // *****************this is how to add listeners for desired usecase*******************
    // //LISTENER #1 (conversations)
    // socket.on('add_new_conversation', (data) => {
    //     console.log("Started new conversation: ", data)
    //     // Send out a message with the data for the new conversation
    //     socket.broadcast.emit('add_convo', data)
    // })
    
    //LISTENER #2 (chat bubbles)
    socket.on('message', (chatId) => {
        console.log("New Chat Bubble: ", chatId)
        io.emit('message_other_clients', {sender: chatId.sender, content: chatId.content, timestamp: chatId.timestamp})
    })
})