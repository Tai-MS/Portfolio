import service from '../services/ticket.service.js'

async function generateTicket(req, res, next){
    const user = req.user;
    const call = await service.generateTicket(user.email)
    res.status(200).json(call)
}

async function verifyStock(req, res, next){

}

async function dateTime(req, res, next){

}

export default {
    generateTicket,
    dateTime,
    verifyStock
}