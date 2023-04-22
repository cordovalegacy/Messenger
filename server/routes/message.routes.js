const MessageController = require('../controllers/message.controller')
const { authenticate } = require('../config/jwt.config')

module.exports = (app) => {
    app.post('/api/newMessage', authenticate , MessageController.createMessage)
    app.get('/api/messagesInOneConversation/:conversationId', MessageController.getMessagesInConversation)
}