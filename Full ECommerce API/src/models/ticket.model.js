import mongoose from "mongoose";

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code: {type: String, required: true},
    date: {type: String, required: true},
    total: {type: Number, required: true},
    purchaser: {type: mongoose.Schema.Types.Mixed, required: true}
})

const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export default ticketModel
