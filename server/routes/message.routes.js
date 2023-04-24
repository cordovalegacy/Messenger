const MessageController = require('../controllers/message.controller')
const { authenticate } = require('../config/jwt.config')

module.exports = (app) => {
    app.post('/api/newMessage', authenticate , MessageController.createMessage)
    app.delete('/api/deleteMessage/:id', authenticate, MessageController.deleteMessage)
    app.get('/api/messagesInOneConversation/:conversationId', MessageController.getMessagesInConversation)
}