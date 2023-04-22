const ConversationModel = require('../models/conversation.model')

module.exports = {

    createConversation: async (req, res) => {
        try{
            console.log(req.body)
            const { users } = req.body //destructuring req.body (req.body must contain two or more users)
            if(!users || users.length < 2){ //{users} must have two userIds and be in an array
                return res.status(400).json({message: "At least two users are required"})
            }
            //if a conversation already exists, return existing conversation
            const existingConversation = await ConversationModel.findOne({users: {$all: users}}).exec()
            if(existingConversation){
                return res.status(200).json(existingConversation)
            }
            const conversation = new ConversationModel({ users }) //creating an instance of conversation schema and passes in the users object to the users field in model
            await conversation.save() //saves the conversation to collection
            return res.status(201).json(conversation) //stop function and return successful creation
        }
        catch(err){
            return res.status(500).json({message: `Could not sync requested conversation: ${err}`}) //failed conversation creation
        }
    },

    getAllConversations: async (req, res) => {
        try{
             //uses the ref to find user object where there is a conversation and populates requested rows
            const conversations = await ConversationModel.find().populate('users', 'email firstName lastName _id')
            return res.status(200).json(conversations)
        }
        catch(err){
            return res.status(500).json({message: `Something went wrong finding all the conversations: ${err}`})
        }
    }

}