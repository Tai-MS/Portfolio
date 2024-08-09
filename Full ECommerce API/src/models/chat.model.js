import mongoose from 'mongoose'

const chatCollection = 'messages'

const chatSchema = new mongoose.Schema({
    user: {type: String},
    message: {type: String, required: true, min: 1}
})

const chatModel = mongoose.model(chatCollection, chatSchema)

export default chatModel