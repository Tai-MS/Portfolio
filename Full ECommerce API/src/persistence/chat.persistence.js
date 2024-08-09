import chatModel from '../models/chat.model.js'

class ChatPersistence{
    async updateDb(user, message){
        const newElement = new chatModel({
            user: user,
            message: message
        })
        return await newElement.save()
    }

    async returnChat(){
        try {
            const messages = await chatModel.find({})

            const formattedMessages = messages.map(message => ({
                user: message.user,
                message: message.message
            }))
            return formattedMessages
        } catch (error) {
            return `Error: ${error}`
        }
    }
}

const chatPersistence = new ChatPersistence

export default chatPersistence