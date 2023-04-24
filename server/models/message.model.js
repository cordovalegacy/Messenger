const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Conversation'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
        required: [true, "Please write a message to send"]
    }
}, {timestamps: true})

const Message = mongoose.model('Message', MessageSchema)
module.exports = Message