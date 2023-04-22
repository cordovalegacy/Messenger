const ConversationController = require('../controllers/conversation.controller')
const { authenticate } = require('../config/jwt.config')

module.exports = (app) => {
    app.post('/api/newConversation', authenticate, ConversationController.createConversation)
    app.get('/api/allConversations', ConversationController.getAllConversations)
}