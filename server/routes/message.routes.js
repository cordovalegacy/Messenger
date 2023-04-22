const MessageController = require('../controllers/message.controller')

module.exports = (app) => {
    app.post('/api/newMessage', MessageController.createMessage)
    app.get('/api/messagesInOneConversation/:conversationId', MessageController.getMessagesInConversation)
}