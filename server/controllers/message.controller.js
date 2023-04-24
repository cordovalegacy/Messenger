const ConversationModel = require('../models/conversation.model')
const MessageModel = require('../models/message.model')

module.exports = {

    createMessage: async (req, res) => {
        try {
            const { conversationId, sender, content } = req.body //<= from client
            const conversation = await ConversationModel.findOne({ _id: conversationId }) //finding conversation by the id we pass from client
            if (!conversation) { //if we don't pass it all the data it needs or the data is invalid it will fail
                return res.status(404).json({ message: "Requested Conversation Was Not Found" })
            }
            //creating an instance of our message schema and passing data to conversation field
            const message = new MessageModel({ conversation: conversationId, sender, content })
            await message.save() //saves valid message object to database

            const populatedMessage = await MessageModel.findOne({ _id: message._id }).populate('sender', 'firstName')
            //adds the newly created message document to the messages array of the conversation model
            conversation.messages.push(populatedMessage)
            await conversation.save()
            res.status(201).json(populatedMessage) //successful operation
        }
        catch (err) {
            return res.status(500).json({message: `Something went wrong trying to create message: ${err}`})
        }
    },

    getMessagesInConversation: async (req, res) => {
        try{
            const { conversationId } = req.params //destructuring the conversationId sent from client
            const conversation = await ConversationModel.findOne({_id: conversationId}).populate({  //find conversation by conversationId 
                path: 'messages',
                populate: {
                    path: 'sender',
                    select: 'firstName lastName email _id'
                }
            })
            console.log("Get Messages In Convo: ", conversation)
            if(conversation){ //if the conversation doesn't come through
                return res.status(200).json(conversation) //returns message array in conversation model instance (hover over json argument for more info)
            }
            //otherwise...
            return res.status(404).json({message: "Conversation was not found"}) //return an error status code
        }
        catch(err){
            return res.status(500).json({message: `Something went wrong getting messages in conversation: ${err}`})
        }
    },

    deleteMessage: (req, res) => {
        MessageModel.deleteOne({_id: req.params.id})
        .then(() => {
            console.log("Successfully deleted your Message")
            res.status(204).send() //no content status code, send success
        })
        .catch((err) => {
            res.status(400).json(err)
        })
    }
}